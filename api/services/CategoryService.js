import { Category, CategoryRelationship, NavigationItem } from "../models/category.js";
import { stringCleaner } from "../utils.js";





async function createCategory(data) {
    // Validate temporal logic
    if (data.validFrom && data.validUntil && data.validFrom >= data.validUntil) {
        throw new InvalidOperationError('validFrom must be before validUntil');
    }

    const category = new Category({
        slug: data.canonicalName ? 
        stringCleaner(data.canonicalName)
        : data.name ? (data.name)
        : data.slug,
        canonicalName: data.canonicalName,
        axis: data.axis,
        attributes: data.attributes || {},
        validFrom: data.validFrom,
        validUntil: data.validUntil
    });

    await category.save();
    return category
}

async function getCategories (){
    return await Category.find({})
}

async function getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) throw new NotFoundError('Category not found');
    return category;
}

async function updateCategory(id, updates) {
    const category = getCategoryById(id)
    if (!category) throw new NotFoundError('Category not found');

    // Prevent axis changes that would break relationships
    if (updates.axis && updates.axis !== category.axis) {
        const hasRelationships = await CategoryRelationship.exists({
            $or: [{ parent: id }, { child: id }]
        });

        if (hasRelationships) {
            throw new InvalidOperationError(
                'Cannot change axis type for categories with existing relationships'
            );
        }
    }

    Object.assign(category, updates);
    return category.save();
}


async function deleteCategory(id) {
    const category = getCategoryById(id)
    if (!category) throw new NotFoundError('Category not found');

    // Check for dependencies
    const [inRelationships, inNavigation] = await Promise.all([
        CategoryRelationship.exists({ $or: [{ parent: id }, { child: id }] }),
        NavigationItem.exists({ 'target.type': 'category', 'target.category': id })
    ]);

    if (inRelationships || inNavigation) {
        throw new ConflictError(
            'Category cannot be deleted while referenced in relationships or navigation'
        );
    }

    return Category.deleteOne({ _id: id });
}

async function getNextSortOrder(parentId = null) {
    const lastItem = await NavigationItem.findOne({ parentNavigationItem: parentId })
        .sort('-sortOrder')
        .select('sortOrder')
        .lean();

    return (lastItem?.sortOrder ?? -1) + 1;
}


// ========================
//  UTILITY METHODS
// ========================

async function isDescendant(potentialAncestorId, categoryId) {
    if (potentialAncestorId.equals(categoryId)) return true;

    const relationships = await CategoryRelationship.find({ child: categoryId });
    if (relationships.length === 0) return false;

    return Promise.any(relationships.map(r =>
        this.isDescendant(potentialAncestorId, r.parent)
    ));
}

async function rebuildNavigationFromCategories() {
    // Example: Auto-create nav items for seasonal categories
    const activeCategories = await Category.find({
        $or: [
            { validFrom: { $exists: false }, validUntil: { $exists: false } },
            {
                validFrom: { $lte: new Date() },
                validUntil: { $gte: new Date() }
            }
        ]
    });

    return Promise.all(activeCategories.map(cat =>
        this.syncCategoryToNavigation(cat._id)
    ));
}


// ========================
//  RELATIONSHIP MANAGEMENT
// ========================

async function createRelationship(parentId, childId, type = 'hierarchical') {
    if (parentId.equals(childId)) {
        throw new InvalidOperationError('Cannot relate a category to itself');
    }

    // Check for circular references
    if (await isDescendant(childId, parentId)) {
        throw new InvalidOperationError('This would create a circular reference');
    }

    const existing = await CategoryRelationship.findOne({ parent: parentId, child: childId });
    if (existing) throw new ConflictError('Relationship already exists');

    const relationship = new CategoryRelationship({
        parent: parentId,
        child: childId,
        relationshipType: type
    });

    return relationship.save();
}

async function getCategoryTree(categoryId) {
    const ancestors = await CategoryRelationship.find({ child: categoryId })
        .populate('parent')
        .sort('-relationshipType'); // hierarchical first

    const descendants = await CategoryRelationship.find({ parent: categoryId })
        .populate('child')
        .sort('relationshipType sortOrder');

    return {
        ancestors: ancestors.map(r => r.parent),
        descendants: descendants.map(r => ({
            category: r.child,
            relationshipType: r.relationshipType
        }))
    };
}


// ========================
//  NAVIGATION INTEGRATION
// ========================

async function syncCategoryToNavigation(categoryId, navigationData = {}) {
    const category = await Category.findById(categoryId);
    if (!category) throw new Error('Category not found');

    return NavigationItem.findOneAndUpdate(
        { 
            targetType: 'category',
            category: categoryId 
        },
        {
            targetType: 'category',
            category: categoryId,
            label: navigationData.label || category.canonicalName,
            icon: navigationData.icon || category.attributes?.icon || '',
            highlight: navigationData.highlight || false,
            parentNavigationItem: navigationData.parentId || null,
            sortOrder: navigationData.sortOrder ?? (await getNextSortOrder(navigationData.parentId))
        },
        { new: true, upsert: true }
    );
}

export {
    createCategory, getCategories, syncCategoryToNavigation,
    deleteCategory
}
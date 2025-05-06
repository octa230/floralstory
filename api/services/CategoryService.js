import { Category, CategoryRelations, NavigationItem } from "../models/category.js";
import { stringCleaner } from "../utils.js";
import Product from "../models/product.js";





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
        image: data.image,
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
    if (!category) throw new Error('Category not found');
    return category;
}

async function updateCategory(id, updates) {
    // Ensure this returns a category or null
    const category = await getCategoryById(id);
    //console.log(id, updates);

    if (!category) throw new Error('Category not found');

    // Prevent axis changes that would break relationships
    if (updates.axis && updates.axis !== category.axis) {
        const hasRelationships = await CategoryRelations.exists({
            $or: [{ parent: id }, { child: id }]
        });

        console.log('Has relationships:', hasRelationships); // Debugging

        if (hasRelationships) {
            throw new Error('Cannot change axis type for categories with existing relationships');
        }
    }

    // Apply updates manually to avoid issues with Object.assign
    category.slug = await stringCleaner(updates.canonicalName)
    category.canonicalName = updates.canonicalName || category.canonicalName;
    category.axis = updates.axis || category.axis;
    category.attributes = updates.attributes || category.attributes;
    category.validFrom = updates.validFrom || category.validFrom;
    category.validUntil = updates.validUntil || category.validUntil;

    // Save the category with updated fields
    try {
        await category.save();
        console.log('Category updated successfully');
    } catch (error) {
        console.error('Error saving category:', error);
        throw error;
    }

    return category;
}



async function deleteCategory(id) {
    const category = getCategoryById(id)
    if (!category) throw new NotFoundError('Category not found');

    // Check for dependencies
    const [inRelationships, inNavigation] = await Promise.all([
        CategoryRelations.exists({ $or: [{ parent: id }, { child: id }] }),
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


async function getCategoryDetails(categoryId) {
    const category = await Category.findById(categoryId)

    const [products, subcategories, related] = await Promise.all([
        Product.find({ category: categoryId }).limit(50),
        CategoryRelations.find({ parent: categoryId })
          .populate('child'),
        CategoryRelations.find({ 
          $or: [
            { parent: categoryId, relationshipType: 'cross-link' },
            { child: categoryId, relationshipType: 'cross-link' }
          ]
        }).populate('parent child')
    ]);

    return {
        category,
        products,
        subcategories: subcategories.map(r => r.child),
        relatedCategories: related.map(r => 
          r.parent._id.equals(req.params.id) ? r.child : r.parent
        )
      };
}

async function getNavigationDetails(categoryId) {
    const { ancestors, descendants } = await getCategoryTree(categoryId);
    console.log("Navigation Details:", { ancestors, descendants });
    return { ancestors, descendants };
}

// ========================
//  UTILITY METHODS
// ========================

async function isDescendant(potentialAncestorId, categoryId) {
    if (potentialAncestorId === categoryId) return true;

    const relationships = await CategoryRelations.find({ child: categoryId });
    if (relationships.length === 0) return false;

    return Promise.any(relationships.map(r =>
        isDescendant(potentialAncestorId, r.parent)
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

async function createRelationship(parentId, childId, type) {
    if (parentId === childId) {
        throw new Error('Cannot relate a category to itself');
    }

    // Check for circular references
    if (await isDescendant(childId, parentId)) {
        throw new Error('This would create a circular reference');
    }

    const existing = await CategoryRelations.findOne({ parent: parentId, child: childId });
    if (existing) throw new Error('Relationship already exists');

    const relationship = new CategoryRelations({
        parent: parentId,
        child: childId,
        relationshipType: type
    });

    relationship.save();
    return relationship
}

async function getCategoryTree(categoryId) {
    // Fetch descendants
    const category = await getCategoryById(categoryId)
    if(!category) throw new Error ('category not found')

    const descendants = await CategoryRelations.find({ parent: categoryId })
        .populate('child') // Populate the child category

    // Fetch ancestors
    const ancestors = await CategoryRelations.find({ child: categoryId })
        .populate('parent') // Populate the parent category
    //console.log(descendants, ancestors)
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
    getCategoryTree, getNavigationDetails, getCategoryById,
    createCategory, getCategories, syncCategoryToNavigation,
    deleteCategory, createRelationship, getCategoryDetails, updateCategory,
}
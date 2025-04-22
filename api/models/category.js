import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    
    // Identification
    slug: { type: String, required: true, unique: true }, // "easter-flowers"
    canonicalName: { type: String, required: true }, // "Easter Flowers"    
    type: String, 

    // Taxonomy Positioning
    axis:{
        type: String,
        index: true,
        enum:['occasion', 'product-type', 'theme', 'demographic', 'season', 'collection']
    },

    // Flexible Metadata
    attributes: mongoose.Schema.Types.Mixed,

    // Temporal Control
    validFrom: Date,
    valitUntil: Date
},
{
    timestamps: true
})
const categoryRelationSchema = new mongoose.Schema({
    parent: {
        type: mongoose.Types.ObjectId, ref:"Category",
        required: true
    },
    child: {
        type: mongoose.Types.ObjectId, ref: "Category",
        required: true
    },
    relationshipType: {
        type: String,
        enum: ['hiracal', 'cross-link', 'combo']
    },
    sortOrder: Number
})

const navItemSchema = new mongoose.Schema({
    // Unified target configuration
    targetType: {
        type: String,
        enum: ['category', 'external-url', 'search-query'],
        required: true
    },
    
    // Target-specific fields (only one will be used based on targetType)
    category: {
        type: mongoose.Types.ObjectId, 
        ref: 'Category',
        required: function() { return this.targetType === 'category'; }
    },
    url: {
        type: String,
        required: function() { return this.targetType === 'external-url'; }
    },
    query: {
        type: String,
        required: function() { return this.targetType === 'search-query'; }
    },
    
    // Display properties
    icon: String,
    label: String,
    highlight: { type: Boolean, default: false },
    
    // Hierarchy
    parentNavigationItem: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'NavigationItem' 
    },
    sortOrder: { type: Number, default: 0 }
});

/* const navItemSchema = new mongoose.Schema({
    // Reference to either category or external link
    
    target:{
        type: String,
        enum: ['category', 'external-url', 'search-query'],
        required: true
    },
    categoryId: {type: mongoose.Types.ObjectId, ref: 'Category'},

    //display properties
    url: String,
    query: String,
    

    //display properties
    icon: String,
    label: String,
    highlight: {type: Boolean, default: false},
    
    //Nesting
    parentNavigationItem: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'NavigationItem' 
      },
    sortOrder: {type: Number, default: 0}
}) */
const CategoryRelationship = mongoose.model('CategoryRelations', categoryRelationSchema)
const NavigationItem = mongoose.model('NavigationItem', navItemSchema)
const Category = mongoose.model('Category', categorySchema)

export {
    Category, 
    CategoryRelationship, 
    NavigationItem
 }
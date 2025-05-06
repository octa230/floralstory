import { Category } from "../models/category.js";
import Product from '../models/product.js'

class SearchService {
    /**
   * Search across products and categories
   * @param {Object} options - Search options
   * @param {string} options.query - Search query string
   * @param {string[]} [options.types] - Types to search (product, category, or both)
   * @param {string} [options.category] - Category ID to filter by
   * @param {number} [options.minPrice] - Minimum price filter
   * @param {number} [options.maxPrice] - Maximum price filter
   * @param {boolean} [options.inStock] - Only show in-stock items
   * @param {number} [options.limit=10] - Maximum results to return
   * @param {number} [options.page=1] - Pagination page number
   * @returns {Promise<Object>} Search results
   */

    static async search({
        query,
        types = ['product', 'category'],
        category,
        minPrice,
        maxPrice,
        inStock,
        limit = 10,
        page = 1
    }){
        const skip =( page - 1) * limit;
        const results = {}
        const searchPromises = [];

        const searchRegex = new RegExp(query, 'i')
        
        
        // Search products if requested
        if(types.includes('product')){
            const productQuery = Product.find({
                $or: [
                    { name: searchRegex },
                    { description: searchRegex },
                    { shortDescription: searchRegex },
                    { slug: searchRegex }
                ]
            })


            //Apply Filters
            if(category){
                productQuery.where('category').equals(category)
            }
            if (minPrice !== undefined) {
                productQuery.where('price').gte(minPrice);
            }
              if (maxPrice !== undefined) {
                productQuery.where('price').lte(maxPrice);
            }
              if (inStock) {
                productQuery.where('inStock').gt(0);
            }

            searchPromises.push(
                productQuery
                .skip(skip)
                .limit(limit)
                .populate('category')
                .exec()
                .then((products)=>{
                    results.products = products
                    results.productsCount = products.length
                })
            )
        }


        // Search categories if requested
        if(types.includes('category')){
            const categoryQuery = Category.find({
                $or: [
                    { canonicalName: searchRegex },
                    { slug: searchRegex }
                ]
            })

            if(category){
                categoryQuery.where('_id').equals(category)
            }

            searchPromises.push(
                categoryQuery
                .skip(skip)
                .limit(limit)
                .exec()
                .then((categories)=>{
                    results.categories = categories,
                    results.categoryCount = categories.length
                })
            )
        }

        await Promise.all(searchPromises)

        return {
            success: true,
            data: results,
            meta: {
              query,
              page,
              limit,
              types
            }
        };

    }


    /**
    * Autocomplete suggestions
    * @param {string} query - Partial search query
    * @param {number} [limit=5] - Maximum suggestions to return
    * @returns {Promise<Object>} Suggestions
    */

    static async autocompleteSearch(query, limit){
        const searchRegex = new RegExp(query, 'i');

        const [products, categories] = await Promise.all([
            Product.find({
                $or:[
                    { name: searchRegex },
                    { slug: searchRegex }
                ]
            })
            .select('name slug image price')
            .limit(limit)
            .exec()
        ])

        return {
            success: true,
            data: {
              products,
              categories
            },
            meta: {
              query,
              limit
            }
        };
    }


    /**
    * Search within a specific category
    * @param {string} categoryId - Category ID to search within
    * @param {Object} options - Search options
    * @returns {Promise<Object>} Category-specific results
    */

    static async searchByCategory(categoryId, options={}){
        return this.search({
            ...options,
            category: categoryId,
            types:['product'] // Only search products within a category
        })
    }
}

export default SearchService
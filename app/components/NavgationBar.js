import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../constants';
import styles from './styles.module.css'



const NavigationBar = () => {
    const [rootCategories, setRootCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [relatedCategories, setRelatedCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showsubs,setShowSubs] = useState(false)

    // Load root categories on initial render
    useEffect(() => {
        const loadRootCategories = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${URL}/navigation`);
                setRootCategories(response.data);
                
                // Auto-select first category if available
                if (response.data.length > 0) {
                    handleCategoryClick(response.data[0]._id);
                }
            } catch (error) {
                console.error('Failed to load categories', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadRootCategories();
    }, []);

    const handleCategoryClick = async (categoryId) => {
        setShowSubs(true)
        setLoading(true);
        try {
            const {data} = await axios.get(`${URL}/navigation/${categoryId}`);
            setSubcategories(data)
            console.log(data)
            //setRelatedCategories(relatedCategories);
        } catch (error) {
            console.error('Failed to load category details', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.navigationContainer }>
            <div className={styles.topNavigation}>
                {rootCategories.map(category => (
                    <button className='btn btn-active-border text-light mx-2 shadow-0' 
                        data-mdb-ripple-init
                        key={category._id}
                        onClick={() => handleCategoryClick(category._id)}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            <div>
                {showsubs && subcategories.length > 0 && (
                    <div className={styles.bottomNavigation}>
                        <div className={styles.axisItems}>
                            {subcategories.map(subcategory => (
                                <button
                                    key={subcategory.category._id}
                                    className={styles.subcategory}
                                    onClick={() => handleCategoryClick(subcategory.category._id)}
                                    style={{ 
                                        animationDelay: `${0.05}s` 
                                      }}
                                >
                                    {subcategory.category.canonicalName}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Related categories (cross-linked) */}
                {setShowSubs && relatedCategories.length > 0 && (
                    <div className="related-section">
                        <h4>Related</h4>
                        <div className="related-items">
                            {relatedCategories.map(related => (
                                <button
                                    key={related._id}
                                    className="nav-item"
                                    onClick={() => handleCategoryClick(related._id)}
                                >
                                    {related.canonicalName}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavigationBar;
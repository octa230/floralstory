export type ProductProps={

}

export type OrderProps={

}

export type userProps ={

}

export type CategoryProps={

}


// types/category.d.ts
export type CategoryAttributes = {
    icon?: string;
    color?: string;
    [key: string]: any; // Flexible additional attributes
  }
  
  export type Category = {
    _id: string;
    slug: string;
    canonicalName: string;
    axis: 'occasion' | 'product-type' | 'theme' | 'demographic' | 'season' | 'collection';
    attributes?: CategoryAttributes;
    validFrom?: Date | string;
    validUntil?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  }
  
  export type CategoryRelationship = {
    _id: string;
    parent: string | Category; // Reference or populated
    child: string | Category; // Reference or populated
    relationshipType: 'hierarchical' | 'cross-link' | 'combo';
    sortOrder?: number;
  }
  
  export type NavigationTarget = {
    type: 'category' | 'external-url' | 'search-query';
    category?: string | Category; // Reference or populated
    url?: string;
    query?: string;
  }
  
  export type NavigationItem = {
    _id: string;
    target: NavigationTarget;
    label: string;
    icon?: string;
    highlight?: boolean;
    parentNavigationItem?: string | NavigationItem; // Reference or populated
    sortOrder?: number;
    children?: NavigationItem[]; // For tree structures
  }
  
  // For API responses
  export type CategoryTree = {
    category: Category;
    ancestors: Category[];
    descendants: Array<{
      category: Category;
      relationshipType: string;
    }>;
  }
  
  // For forms
  export type CategoryFormData = {
    slug: string;
    canonicalName: string;
    axis: string;
    attributes?: CategoryAttributes;
    validFrom?: string; // ISO date string
    validUntil?: string; // ISO date string
  }
  
  export type NavigationFormData ={
    label: string;
    icon?: string;
    parentId?: string | null;
    highlight?: boolean;
  }
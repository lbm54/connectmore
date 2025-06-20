// Types for categories, subcategories, and tags
export interface Category {
  id: number;
  category_name: string;
  event_subcategories: Subcategory[];
}

export interface Subcategory {
  id: number;
  category_id: number;
  subcategory_name: string;
}

export interface Tag {
  id: number;
  tag_name: string;
} 
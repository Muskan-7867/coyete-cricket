export type SubSubCategoryT = {
  _id: string;
  name: string;
  parentCategory: string;
  parentSubCategory?: string | SubCategoryT;
  subcategories?: SubCategoryT[];
  rank: number;
};

export type SubCategoryT = {
  _id: string;
  name: string;
  parentCategory: string | CategoryT;
  parentSubCategory?: string | null;
  subcategories?: SubCategoryT[];
  subSubCategories?: SubSubCategoryT[];
  rank: number;
  slug?: string;
};

export type CategoryT = {
  _id: string;
  name: string;
  description?: string | null;
  subcategories: SubCategoryT[];
  rank: number;
  slug?: string;
};

export interface ProductImage {
  publicId: string;
  url: string;
  rank: number;
}

export interface ProductFormData {
  name: string;
  shortDescription: string;
  detailedDescription: string;
  price: number;
  originalPrice: number;
  discount: number;
  tax: number;
  quality: string;
  category: string;
  subcategory: string;
  size: string;
  colors: string;
  tags: string[];
  inStock: boolean;
  images: File[];
  imageRanks?: number[]; // Add this for tracking ranks during form submission
}

// ✅ Type for API responses
export interface SizeT {
  _id: string;
  name: string;
  categoryId: string;
  category?: {
    _id: string;
  };
  dimensions?: string;
  code?: string;
}

export interface QualityT {
  _id: string;
  name: string;
  description?: string;
  level?: string;
}

export interface ColorT {
  _id: string;
  name: string;
  value: string;
  code: string;
  hexCode?: string;
}

// ✅ Response type for sizes API
export interface SizesResponse {
  success: boolean;
  data?: any;
  message?: string;
  sizes?: SizeT[];
}

import { useQuery } from "@tanstack/react-query";
import { getQualitiesAction } from "../actions/qualityActions";
import { getColorsAction } from "../actions/colorActions";
import { getSizesAction } from "../actions/sizeAction";
import { getAllCategories } from "../actions/categoryActions";
import { getAllSubcategories, getSubcategoriesByCategory } from "../actions/subCategoryActions";

export const useCategories = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 5
  });
};

export const useSizes = () => {
  return useQuery({
    queryKey: ["sizes"],
    queryFn: getSizesAction,
    staleTime: 1000 * 60 * 5
  });
};

export const useColors = () => {
  return useQuery({
    queryKey: ["colors"],
    queryFn: getColorsAction,
    staleTime: 1000 * 60 * 5
  });
};

export const useQuality = () => {
  return useQuery({
    queryKey: ["qualities"],
    queryFn: getQualitiesAction,
    staleTime: 1000 * 60 * 5
  });
};
export const useSubcategories = (categoryId: string) => {
  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const res = await getSubcategoriesByCategory(categoryId);
      if (res.success) return res.subcategories;
      return [];
    },
    enabled: !!categoryId, // only fetch if categoryId exists
    staleTime: 1000 * 60 * 5
  });
};


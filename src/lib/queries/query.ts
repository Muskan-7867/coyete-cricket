import { useQuery } from "@tanstack/react-query";
import { getQualitiesAction } from "../actions/qualityActions";
import { getColorsAction } from "../actions/colorActions";
import { getSizesAction } from "../actions/sizeAction";
import { getAllCategories } from "../actions/categoryActions";
import { getAllSubcategories } from "../actions/subCategoryActions";

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

export const useSubcategories = (id: string) => {
  console.log("from query", id);
  return useQuery({
    queryKey: ["subcategories", id],
    queryFn: () => getAllSubcategories(id),
    staleTime: 1000 * 60 * 5
  });
};

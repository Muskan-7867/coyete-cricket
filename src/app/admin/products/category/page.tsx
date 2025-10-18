import CategoryManagement from "@/components/user/products/CategoryManagement";
import { getAllCategories } from "@/lib/actions/categoryActions";

export default async function CategoriesPage() {
  const categories = await getAllCategories(); 
  return <CategoryManagement initialCategories={categories} />;
}

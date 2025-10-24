import CategoryPage from "@/components/user/products/CategoryPage";
import { fetchProductsByCategory } from "@/lib/actions/getProducts";

interface PageProps {
  params: {
    categoryId?: string;
    subCategoryId?: string;
    subSubCategoryId?: string;
  };
}

function normalizeCategoryName(categoryPath: string | string[]): string {
  if (!categoryPath) return "";
  const pathArray = Array.isArray(categoryPath) ? categoryPath : [categoryPath];
  return pathArray.map((seg) => decodeURIComponent(seg.trim())).join("/");
}

export default async function Page({ params }: PageProps) {
  // ✅ Ensure params.name is awaited or fully resolved
  const categorySegments = Array.isArray(params.name)
    ? params.name
    : [params.name];

  const categoryName = normalizeCategoryName(categorySegments);
  console.log("from cat pg", categoryName);
  const products = await fetchProductsByCategory({
    categoryPath: categoryName
  });

  return <CategoryPage categoryName={categoryName} products={products} />;
}

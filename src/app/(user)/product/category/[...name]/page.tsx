import CategoryPage from "@/components/user/products/CategoryPage";

interface PageProps {
  params: {
    name: string[];
  };
}

export default function Page({ params }: PageProps) {
  // ✅ Join subcategory path segments properly
  const categoryPath = Array.isArray(params.name)
    ? params.name.join("/")
    : params.name;

  return <CategoryPage categoryName={categoryPath} />;
}

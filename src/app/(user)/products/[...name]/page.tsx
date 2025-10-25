import CategoryPage from "@/components/user/products/CategoryPage";
import { getCategoryIdByName } from "@/lib/actions/categoryActions";
import { fetchProductsByCategory } from "@/lib/actions/getProducts";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{
    name?: string[];
  }>;
  searchParams: Promise<{
    subcategories?: string | string[];
    sizes?: string | string[];
    colors?: string | string[];
    qualities?: string | string[];
    price_min?: string;
    price_max?: string;
    sort?: string;
  }>;
}

function normalizeCategoryName(
  categoryPath: string | string[] | undefined
): string {
  if (!categoryPath) return "";
  const pathArray = Array.isArray(categoryPath) ? categoryPath : [categoryPath];
  return pathArray.map((seg) => decodeURIComponent(seg.trim())).join("/");
}

// Helper function to normalize search params
function normalizeSearchParams(searchParams: any) {
  const normalized: any = {};

  // Handle array parameters
  const arrayParams = ["subcategories", "sizes", "colors", "qualities"];
  arrayParams.forEach((param) => {
    if (searchParams[param]) {
      normalized[param] = Array.isArray(searchParams[param])
        ? searchParams[param]
        : [searchParams[param]];
    }
  });

  // Handle other parameters
  if (searchParams.price_min) normalized.price_min = searchParams.price_min;
  if (searchParams.price_max) normalized.price_max = searchParams.price_max;
  if (searchParams.sort) normalized.sort = searchParams.sort;

  return normalized;
}

// Helper function to serialize MongoDB data
function serializeData(data: any): any {
  if (data === null || data === undefined) return data;

  if (Array.isArray(data)) {
    return data.map((item) => serializeData(item));
  }

  if (typeof data === "object" && data._id) {
    const serialized = { ...data };
    serialized._id = data._id.toString();

    Object.keys(serialized).forEach((key) => {
      if (typeof serialized[key] === "object" && serialized[key] !== null) {
        serialized[key] = serializeData(serialized[key]);
      }
    });

    return serialized;
  }

  return data;
}

// Loading component
function CategoryLoading() {
  return (
    <div className="min-h-screen mt-26 lg:mt-32">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="lg:w-3/4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// In your page component, update the CategoryContent function:
async function CategoryContent({
  params,
  searchParams
}: {
  params: Promise<{ name?: string[] }>;
  searchParams: Promise<{
    subcategories?: string | string[];
    sizes?: string | string[];
    colors?: string | string[];
    qualities?: string | string[];
    price_min?: string;
    price_max?: string;
    sort?: string;
  }>;
}) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ]);

  const categorySegments = resolvedParams.name || [];
  const categoryName = normalizeCategoryName(categorySegments);
  const filters = normalizeSearchParams(resolvedSearchParams);

  console.log("Category:", categoryName);
  console.log("Filters:", filters);

  const [products, categoryId] = await Promise.all([
    fetchProductsByCategory({
      categoryPath: categoryName,
      filters: {
        subcategories: filters.subcategories,
        sizes: filters.sizes,
        colors: filters.colors,
        qualities: filters.qualities,
        price_min: filters.price_min,
        price_max: filters.price_max
      }
    }),
    getCategoryIdByName(categoryName)
  ]);

  // ✅ Serialize the data before passing to client component
  const serializedProducts = serializeData(products);
  const serializedCategoryId =
    typeof categoryId === "object" ? categoryId.toString() : categoryId;

  return (
    <CategoryPage
      categoryId={serializedCategoryId}
      categoryName={categoryName}
      products={serializedProducts}
      initialFilters={{
        subcategories: filters.subcategories || [],
        sizes: filters.sizes || [],
        colors: filters.colors || [],
        qualities: filters.qualities || []
      }}
    />
  );
}

export default function Page({ params, searchParams }: PageProps) {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

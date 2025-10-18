import SingleProductPage from "@/components/user/products/SingleProductPage";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return <SingleProductPage slug={slug} />;
}

"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, ArrowLeft, Heart, Share2, Truck } from "lucide-react";
import { getProductBySlug } from "@/lib/actions/getProductAction"; // Add this import
import { getCategoryById } from "@/lib/actions/categoryActions";
import { getColorsByIds } from "@/lib/actions/colorActions";
import { getQualityById } from "@/lib/actions/qualityActions";
import { getSubcategoryById } from "@/lib/actions/subCategoryActions";
import { getSizeById } from "@/lib/actions/sizeAction";
import { CategoryT, ColorT, QualityT, SizeT, SubCategoryT } from "@/types";

interface Product {
  _id: string;
  name: string;
  slug: string; // Add slug to interface
  price: number;
  originalPrice?: number;
  shortDescription: string;
  detailedDescription: string;
  images?: { url: string; alt?: string }[];
  rating?: number;
  reviews?: number;
  features?: string[];
  color?: string;
  colors?: string[];
  category: string;
  subcategory?: string;
  size?: string;
  quality?: string;
}

interface SingleProductPageProps {
  slug: string; // Change from id to slug
}

function SingleProductPage({ slug }: SingleProductPageProps) { // Change prop to slug
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [category, setCategory] = useState<CategoryT | null>(null);
  const [subcategory, setSubcategory] = useState<SubCategoryT | null>(null);
  const [size, setSize] = useState<SizeT | null>(null);
  const [quality, setQuality] = useState<QualityT | null>(null);
  console.log(size, quality, subcategory, category);
  const [availableColors, setAvailableColors] = useState<ColorT[]>([]);

  const imageRef = useRef<HTMLDivElement>(null);

  const fetchReferenceData = async (product: Product) => {
    try {
      const promises = [];

      if (product.category) {
        promises.push(
          getCategoryById(product.category)
            .then(res => res.success ? setCategory(res.category) : setCategory(null))
            .catch(() => setCategory(null))
        );
      }

      if (product.subcategory) {
        promises.push(
          getSubcategoryById(product.subcategory)
            .then(res => res.success ? setSubcategory(res.subcategory) : setSubcategory(null))
            .catch(() => setSubcategory(null))
        );
      }

      if (product.size) {
        promises.push(
          getSizeById(product.size)
            .then(res => res.success ? setSize(res.size) : setSize(null))
            .catch(() => setSize(null))
        );
      }

      if (product.quality) {
        promises.push(
          getQualityById(product.quality)
            .then(res => res.success ? setQuality(res.quality) : setQuality(null))
            .catch(() => setQuality(null))
        );
      }

      const colorIds = product.colors && product.colors.length > 0 
        ? product.colors 
        : product.color 
          ? [product.color] 
          : [];

      if (colorIds.length > 0) {
        promises.push(
          getColorsByIds(colorIds)
            .then(res => res.success ? setAvailableColors(res.colors) : setAvailableColors([]))
            .catch(() => setAvailableColors([]))
        );
      }

      await Promise.all(promises);
    } catch (error) {
      console.error("Error fetching reference data:", error);
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Use getProductBySlug instead of getSingleProduct
        const res = await getProductBySlug(slug);
        if (res.success && res.product) {
          setProduct(res.product);
          await fetchReferenceData(res.product);
          
          if (res.product.colors && res.product.colors.length > 0) {
            setSelectedColor(res.product.colors[0]);
          } else if (res.product.color) {
            setSelectedColor(res.product.color);
          }
        } else {
          setError(res.message || "Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]); // Change dependency to slug

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return;
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleBackClick = () => {
    router.back();
  };

  const getColors = (): ColorT[] => {
    if (availableColors.length > 0) {
      return availableColors;
    }
    return [
      { _id: "natural", name: "Natural", value: "Natural", code: "natural", hexCode: "#fef3c7" },
      { _id: "stained", name: "Stained", value: "Stained", code: "stained", hexCode: "#92400e" }
    ];
  };

  const getImages = () => {
    if (!product?.images)
      return [{ url: "/assets/tshirt.png", alt: "Product image" }];
    return Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [{ url: "/assets/tshirt.png", alt: "Product image" }];
  };

  const getColorDisplay = (color: ColorT) => {
    return {
      name: color.name,
      class: color.hexCode ? `bg-[${color.hexCode}]` : 
             color.code === 'white' ? 'bg-white border border-gray-300' :
             color.code === 'natural' ? 'bg-amber-100' :
             color.code === 'stained' ? 'bg-amber-800' :
             color.code === 'red' ? 'bg-red-500' :
             color.code === 'blue' ? 'bg-blue-500' :
             color.code === 'green' ? 'bg-green-500' :
             color.code === 'black' ? 'bg-gray-900' : 'bg-gray-200'
    };
  };

  // Function to truncate detailed description
  const getTruncatedDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Check if detailed description is long enough to need truncation
  const isDetailedDescriptionLong = product?.detailedDescription && product.detailedDescription.length > 150;

  if (loading)
    return (
      <div className="min-h-screen mt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen mt-24 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen mt-24 flex items-center justify-center">
        Product not found
      </div>
    );

  const images = getImages();
  const colors = getColors();

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

  return (
    <div className="min-h-screen mt-24 sm:mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </button>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 sm:p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div
                ref={imageRef}
                className="aspect-square rounded-xl overflow-hidden relative cursor-zoom-in border border-gray-200 bg-gray-50"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <div
                  className="w-full h-full transition-transform duration-200 ease-out"
                  style={{
                    backgroundImage: `url(${images[activeImage]?.url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: isZoomed ? "200%" : "contain",
                    backgroundPosition: isZoomed
                      ? `${zoomPosition.x}% ${zoomPosition.y}%`
                      : "center",
                  }}
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex flex-wrap justify-center gap-3">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        activeImage === index
                          ? "border-amber-500 shadow-md"
                          : "border-gray-200 hover:border-amber-300"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt || `Product view ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              {/* Product Title and Rating */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (product.rating || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating || 0}.0 • {product.reviews || 0} Reviews
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </div>

              {/* Delivery Info */}
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">Free Delivery</span>
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                {/* Short Description - Always shown */}
                {product.shortDescription && (
                  <div className="space-y-2">
                    <p className="text-gray-600 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>
                )}

                {/* Detailed Description */}
                {product.detailedDescription && (
                  <div className="space-y-2">
                    <p className="text-gray-600 leading-relaxed">
                      {showFullDescription 
                        ? product.detailedDescription
                        : getTruncatedDescription(product.detailedDescription)
                      }
                    </p>
                    
                    {/* Show Read More/Less button only if detailed description is long */}
                    {isDetailedDescriptionLong && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 text-sm"
                      >
                        {showFullDescription ? "Read less" : "Read more"}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-lg">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Color Selection */}
              {colors.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => {
                      const colorDisplay = getColorDisplay(color);
                      return (
                        <button
                          key={color._id}
                          onClick={() => setSelectedColor(color._id)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 ${
                            selectedColor === color._id
                              ? "border-amber-500 bg-amber-50"
                              : "border-gray-300 bg-white hover:border-amber-400"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full ${colorDisplay.class} border border-gray-300`}
                          />
                          <span className="font-medium text-gray-700">
                            {colorDisplay.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                  Add to Cart ₹{product.price}
                </button>
                <button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                  Buy Now
                </button>
              </div>

              {/* Additional Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button className="flex items-center gap-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 bg-white">
                  <Heart className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">Wishlist</span>
                </button>
                <button className="flex items-center gap-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 bg-white">
                  <Share2 className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProductPage;
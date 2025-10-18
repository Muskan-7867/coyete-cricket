"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package
} from "lucide-react";

const products = [
  {
    id: "CRK001",
    name: "SS Ton Player Edition Bat",
    category: "Bats",
    price: 249.99,
    originalPrice: 299.99,
    inStock: true,
    rating: 4.8,
    reviews: 142,
    image:
      "https://images.unsplash.com/photo-1604909053089-438ef2e6b24d?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "CRK002",
    name: "Gray-Nicolls Test Gloves",
    category: "Gloves",
    price: 69.99,
    inStock: true,
    rating: 4.5,
    reviews: 86,
    image:
      "https://images.unsplash.com/photo-1629720857513-bd992cd7482c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "CRK003",
    name: "Kookaburra Regulation Ball",
    category: "Balls",
    price: 24.99,
    inStock: false,
    rating: 4.6,
    reviews: 64,
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "CRK004",
    name: "MRF Chase Master Bat",
    category: "Bats",
    price: 299.99,
    originalPrice: 349.99,
    inStock: true,
    rating: 4.9,
    reviews: 210,
    image:
      "https://images.unsplash.com/photo-1614275690870-3a9c6b55e47b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "CRK005",
    name: "SG Test Pro Pads",
    category: "Protective Gear",
    price: 89.99,
    inStock: true,
    rating: 4.7,
    reviews: 52,
    image:
      "https://images.unsplash.com/photo-1629720857513-bd992cd7482c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "CRK006",
    name: "New Balance CK4040 V5",
    category: "Footwear",
    price: 119.99,
    inStock: false,
    rating: 4.4,
    reviews: 98,
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "CRK007",
    name: "Adidas Cricket Polo Shirt",
    category: "Clothing",
    price: 49.99,
    inStock: true,
    rating: 4.2,
    reviews: 33,
    image:
      "https://images.unsplash.com/photo-1621512534314-2f71b4b7e7c0?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "CRK008",
    name: "SG Pro Duffle Kit Bag",
    category: "Accessories",
    price: 79.99,
    inStock: true,
    rating: 4.6,
    reviews: 40,
    image:
      "https://images.unsplash.com/photo-1575231473827-9c5971c062a4?q=80&w=800&auto=format&fit=crop"
  }
];

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [productList, setProductList] = useState(products);

  const categories = [
    "all",
    "Bats",
    "Protective Gear",
    "Balls",
    "Gloves",
    "Footwear",
    "Clothing",
    "Accessories"
  ];

  const filteredProducts = productList.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProductList((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  const getStockStatus = (inStock: boolean) => {
    return inStock ? (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        In Stock
      </span>
    ) : (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
        Out of Stock
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">
            Manage your cricket equipment inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/products/category"
            className="inline-flex items-center px-4 py-2 bg-main text-white rounded-lg hover:bg-main transition-colors"
          >
            <Plus className="mr-2" size={16} />
            Add Category
          </Link>
          <Link
            href="/admin/products/size-quality-color"
            className="inline-flex items-center px-4 py-2 bg-main text-white rounded-lg hover:bg-main transition-colors"
          >
            <Plus className="mr-2" size={16} />
            Add Product Attributes
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center px-4 py-2 bg-main text-white rounded-lg hover:bg-main transition-colors"
          >
            <Plus className="mr-2" size={16} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent appearance-none bg-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Product", "Category", "Price", "Stock", "Rating", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {product.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">${product.price}</div>
                    {product.originalPrice && (
                      <div className="text-gray-500 line-through text-xs">
                        ${product.originalPrice}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStockStatus(product.inStock)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-gray-500 ml-1">
                        ({product.reviews})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-700 p-1 rounded"
                        title="View Product"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-main hover:text-main p-1 rounded"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700 p-1 rounded"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first product"}
            </p>
            {!searchTerm && selectedCategory === "all" && (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center px-4 py-2 bg-main text-white rounded-lg hover:bg-main transition-colors"
              >
                <Plus className="mr-2" size={16} />
                Add Your First Product
              </Link>
            )}
          </div>
        )}
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {productList.length}
          </div>
          <div className="text-sm text-gray-600">Total Products</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-2xl font-bold text-main">
            {productList.filter((p) => p.inStock).length}
          </div>
          <div className="text-sm text-gray-600">In Stock</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {productList.filter((p) => !p.inStock).length}
          </div>
          <div className="text-sm text-gray-600">Out of Stock</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {categories.length - 1}
          </div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
      </div>
    </div>
  );
}

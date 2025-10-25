"use client";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const stats = [
    {
      name: "Total Products",
      value: "156",
      change: "+12%",
      changeType: "increase",
      icon: Package,
      color: "bg-blue-500"
    },
    {
      name: "Total Orders",
      value: "2,847",
      change: "+8%",
      changeType: "increase",
      icon: ShoppingCart,
      color: "bg-main"
    },
    {
      name: "Total Customers",
      value: "1,234",
      change: "+15%",
      changeType: "increase",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      name: "Revenue",
      value: "$45,678",
      change: "-2%",
      changeType: "decrease",
      icon: DollarSign,
      color: "bg-yellow-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2 bg-main text-white rounded-lg hover:bg-main transition-colors"
        >
          <Plus className="mr-2" size={16} />
          Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>

            <div className="flex items-center mt-4">
              {stat.changeType === "increase" ? (
                <TrendingUp className="text-main mr-1" size={16} />
              ) : (
                <TrendingDown className="text-red-500 mr-1" size={16} />
              )}
              <span
                className={`text-sm font-medium ${
                  stat.changeType === "increase" ? "text-main" : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                from last month
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/products/new"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Add New Product
            </Link>
            <Link
              href="/admin/orders"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              View All Orders
            </Link>
            <Link
              href="/admin/customers"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Manage Customers
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Low Stock Alert
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Cricket Bat Pro</span>
              <span className="text-sm text-red-600 font-medium">5 left</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Helmet Guard</span>
              <span className="text-sm text-red-600 font-medium">3 left</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Cricket Gloves</span>
              <span className="text-sm text-red-600 font-medium">8 left</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium">John Smith</span> placed an order
              <span className="text-gray-400 ml-1">2 hours ago</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">New product</span> added to
              inventory
              <span className="text-gray-400 ml-1">4 hours ago</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Sarah Johnson</span> left a review
              <span className="text-gray-400 ml-1">6 hours ago</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

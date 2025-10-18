"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  UserPlus,
  Users,
} from "lucide-react";

const customers = [
  {
    id: "CUS1001",
    name: "Rohit Sharma",
    email: "rohit@gmail.com",
    phone: "+91 9876543210",
    type: "Premium",
    orders: 12,
    totalSpent: 1299.99,
    joinDate: "2024-12-20",
    active: true,
  },
  {
    id: "CUS1002",
    name: "Virat Kohli",
    email: "virat@gmail.com",
    phone: "+91 9765432109",
    type: "Regular",
    orders: 7,
    totalSpent: 749.5,
    joinDate: "2025-01-15",
    active: true,
  },
  {
    id: "CUS1003",
    name: "KL Rahul",
    email: "klrahul@gmail.com",
    phone: "+91 8899776655",
    type: "New",
    orders: 2,
    totalSpent: 199.99,
    joinDate: "2025-08-05",
    active: true,
  },
  {
    id: "CUS1004",
    name: "Shubman Gill",
    email: "gill@gmail.com",
    phone: "+91 9988776655",
    type: "Regular",
    orders: 10,
    totalSpent: 999.0,
    joinDate: "2024-09-12",
    active: false,
  },
  {
    id: "CUS1005",
    name: "MS Dhoni",
    email: "dhoni@gmail.com",
    phone: "+91 9090909090",
    type: "Premium",
    orders: 20,
    totalSpent: 2099.99,
    joinDate: "2023-11-01",
    active: true,
  },
];

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [customerList] = useState(customers);

  const types = ["all", "New", "Regular", "Premium"];

  const filteredCustomers = customerList.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || customer.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getActiveBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
        Inactive
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage and view registered users</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/customers/new"
            className="inline-flex items-center px-4 py-2 bg-main text-white rounded-lg hover:bg-main transition-colors"
          >
            <UserPlus className="mr-2" size={16} />
            Add Customer
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
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent appearance-none bg-white"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Customer",
                  "Email",
                  "Phone",
                  "Type",
                  "Orders",
                  "Total Spent",
                  "Joined",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.type === "Premium"
                          ? "bg-yellow-100 text-yellow-800"
                          : customer.type === "Regular"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {customer.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {customer.joinDate}
                  </td>
                  <td className="px-6 py-4">{getActiveBadge(customer.active)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="text-blue-600 hover:text-blue-700 p-1 rounded"
                      title="View Customer"
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No customers found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {customerList.length}
          </div>
          <div className="text-sm text-gray-600">Total Customers</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {customerList.filter((c) => c.active).length}
          </div>
          <div className="text-sm text-gray-600">Active Customers</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {customerList.filter((c) => c.type === "Premium").length}
          </div>
          <div className="text-sm text-gray-600">Premium Members</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {customerList.filter((c) => c.type === "New").length}
          </div>
          <div className="text-sm text-gray-600">New Customers</div>
        </div>
      </div>
    </div>
  );
}

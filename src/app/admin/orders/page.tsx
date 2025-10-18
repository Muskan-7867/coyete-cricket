"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Filter, Eye, Truck,  Package } from "lucide-react";

const orders = [
  {
    id: "ORD1001",
    customer: "Rohit Sharma",
    date: "2025-10-01",
    status: "Delivered",
    total: 249.99,
    paymentMethod: "Razorpay",
    items: 3,
  },
  {
    id: "ORD1002",
    customer: "Virat Kohli",
    date: "2025-10-02",
    status: "Processing",
    total: 149.5,
    paymentMethod: "COD",
    items: 2,
  },
  {
    id: "ORD1003",
    customer: "KL Rahul",
    date: "2025-10-05",
    status: "Pending",
    total: 89.99,
    paymentMethod: "Razorpay",
    items: 1,
  },
  {
    id: "ORD1004",
    customer: "Shubman Gill",
    date: "2025-10-06",
    status: "Cancelled",
    total: 199.0,
    paymentMethod: "Razorpay",
    items: 4,
  },
  {
    id: "ORD1005",
    customer: "Jasprit Bumrah",
    date: "2025-10-09",
    status: "Delivered",
    total: 349.99,
    paymentMethod: "COD",
    items: 5,
  },
];

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [orderList, setOrderList] = useState(orders);
  console.log(setOrderList)

  const statuses = ["all", "Pending", "Processing", "Delivered", "Cancelled"];

  const filteredOrders = orderList.filter((order) => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Pending: "bg-yellow-100 text-yellow-800",
      Processing: "bg-blue-100 text-blue-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/orders"
            className="inline-flex items-center px-4 py-2 bg-main text-white rounded-lg hover:bg-main transition-colors"
          >
            <Truck className="mr-2" size={16} />
            Manage Shipping
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
              placeholder="Search by customer or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent appearance-none bg-white"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All Statuses" : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Order ID", "Customer", "Date", "Status", "Total", "Payment", "Items", "Actions"].map((header) => (
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
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.paymentMethod}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.items}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:text-blue-700 p-1 rounded"
                      title="View Order Details"
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
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
          <div className="text-2xl font-bold text-gray-900">{orderList.length}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {orderList.filter((o) => o.status === "Processing").length}
          </div>
          <div className="text-sm text-gray-600">Processing</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {orderList.filter((o) => o.status === "Delivered").length}
          </div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {orderList.filter((o) => o.status === "Cancelled").length}
          </div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
      </div>
    </div>
  );
}

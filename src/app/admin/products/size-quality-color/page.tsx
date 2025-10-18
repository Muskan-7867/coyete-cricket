"use client";

import React from "react";

import Size from "@/components/admin/prodAttributes/Size";
import Quality from "@/components/admin/prodAttributes/Quality";
import Color from "@/components/admin/prodAttributes/Color";



export default function SizeQualityColor() {
  
  return (
      <div className="p-2 w-full mx-auto">
        <h1 className="text-3xl font-bold mb-8">Manage Product Attributes</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sizes Section */}
          <Size />
          {/* Qualities Section */}
          <Quality />

          {/* Colors Section */}
          <Color />
        </div>
      </div>
  );
}


import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  title: string;
  category: string;
  productName: string;
  price: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export function ProductCard({
  title,
  category,
  productName,
  price,
  isNew = false,
  isBestSeller = false,
}: ProductCardProps) {
  return (
    <Card className="w-80 overflow-hidden border-none shadow-lg">
      <div className="relative">
        {/* Product Image Placeholder */}
        <div className="h-64 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Product Image</span>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isBestSeller && (
            <Badge className="bg-blue-600 text-white px-3 py-1">
              Best Series
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-green-600 text-white px-3 py-1">
              Just In
            </Badge>
          )}
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800 px-3 py-1">
            {category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
          <p className="text-gray-600">{productName}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">{price}</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
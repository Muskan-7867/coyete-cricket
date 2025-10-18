"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NavigationTabsProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function NavigationTabs({
  defaultValue = "best-sellers",
  onValueChange
}: NavigationTabsProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <Tabs
        defaultValue={defaultValue}
        className="w-full"
        onValueChange={onValueChange}
      >
        <TabsList className="w-full grid grid-cols-2 gap-2 h-auto bg-transparent p-0 md:flex md:gap-4 md:justify-start md:h-14">
          <TabsTrigger
            value="best-sellers"
            className="
              px-4 py-3 text-base font-medium 
              data-[state=active]:text-white
              data-[state=active]:border-b-2 
              data-[state=active]:bg-orange-400
              rounded-md
              bg-black text-white
              transition-all duration-200
              w-full
            "
          >
            Best sellers
          </TabsTrigger>
          <TabsTrigger
            value="our-favourites"
            className="
              px-4 py-3 text-base font-medium 
              data-[state=active]:text-white
              data-[state=active]:border-b-2 
              data-[state=active]:bg-orange-400
              rounded-md
              bg-black text-white
              transition-all duration-200
              w-full
            "
          >
            Our Favourites
          </TabsTrigger>
          <TabsTrigger
            value="just-in"
            className="
              px-4 py-3 text-base font-medium 
              data-[state=active]:text-white
              data-[state=active]:border-b-2 
              data-[state=active]:bg-orange-400
              rounded-md
              bg-black text-white
              transition-all duration-200
              w-full
            "
          >
            Just In
          </TabsTrigger>
          <TabsTrigger
            value="sale"
            className="
              px-4 py-3 text-base font-medium 
              data-[state=active]:text-white
              data-[state=active]:border-b-2 
              data-[state=active]:bg-orange-400
              rounded-md
              bg-black text-white
              transition-all duration-200
              w-full
            "
          >
            Sale
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
"use client";

import { ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect, useTransition } from "react";
import { CategoryT, SubCategoryT } from "@/types";

// ----------------------- Helper -----------------------
const buildCategoryPath = (
  category: SubCategoryT,
  basePath: string = ""
): string => {
  return `${basePath}/${category.name}`;
};

// ----------------------- SubCategoryList -----------------------
const SubCategoryList = ({
  subcategories,
  isMobile,
  parentPath = ""
}: {
  subcategories?: SubCategoryT[];
  isMobile?: boolean;
  parentPath?: string;
}) => {
  const [openSubIds, setOpenSubIds] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const toggleSub = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenSubIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubCategoryClick = (
    subcategory: SubCategoryT,
    currentPath: string,
    hasChildren: boolean,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    e.preventDefault();

    setOpenSubIds([]);

    router.push(`/product/category${currentPath}`);

    if (hasChildren && isMobile) {
      setOpenSubIds((prev) =>
        prev.includes(subcategory._id)
          ? prev.filter((x) => x !== subcategory._id)
          : [...prev, subcategory._id]
      );
    }
  };

  const sortedSubcategories = Array.isArray(subcategories)
    ? subcategories.slice().sort((a, b) => (a.rank || 0) - (b.rank || 0))
    : [];

  return (
    <ul className={`${isMobile ? "pl-4 ml-2" : "ml-3"} space-y-1 mt-1`}>
      {sortedSubcategories.length > 0 ? (
        sortedSubcategories.map((sub) => {
          const hasChildren =
            Array.isArray(sub.subcategories) && sub.subcategories.length > 0;
          const isOpen = openSubIds.includes(sub._id);
          const currentPath = buildCategoryPath(sub, parentPath);
          const isActive = pathname === `/product/category${currentPath}`;

          return (
            <li key={sub._id} className="group">
              <button
                onClick={(e) =>
                  handleSubCategoryClick(sub, currentPath, hasChildren, e)
                }
                className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md transition-all ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-50 hover:text-blue-700 text-gray-700"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {hasChildren && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSub(sub._id, e);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleSub(sub._id, e as any);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className="p-0.5 hover:bg-gray-200 rounded cursor-pointer"
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          isOpen ? "rotate-180 text-blue-600" : "text-gray-500"
                        }`}
                      />
                    </span>
                  )}
                  <span className="text-sm font-medium">{sub.name}</span>
                </span>
              </button>

              {hasChildren && isOpen && (
                <SubCategoryList
                  subcategories={sub.subcategories}
                  isMobile={isMobile}
                  parentPath={currentPath}
                />
              )}
            </li>
          );
        })
      ) : (
        <li className="text-gray-500 text-sm px-2">No subcategories</li>
      )}
    </ul>
  );
};

// ----------------------- CategoryMenu -----------------------
export const CategoryMenu = ({
  menus,
  isMobile
}: {
  menus?: CategoryT[];
  isMobile?: boolean;
}) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [isPending, startTransition] = useTransition();

  const sortedMenus = Array.isArray(menus)
    ? menus.slice().sort((a, b) => (a.rank || 0) - (b.rank || 0))
    : [];

  const menusWithSortedSubcategories = sortedMenus.map((menu) => ({
    ...menu,
    subcategories: Array.isArray(menu.subcategories)
      ? menu.subcategories.slice().sort((a, b) => (a.rank || 0) - (b.rank || 0))
      : []
  }));

  const visibleMenus = menusWithSortedSubcategories.slice(0, 7);
  const remainingMenus = menusWithSortedSubcategories.slice(7);

  const handleCategoryClick = (category: CategoryT) => {
    setOpenIds([]);
    setMoreOpen(false);

    startTransition(() => {
      router.push(`/product/category/${category.name}`);
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, []);

  const handleMouseEnter = (menuId: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setOpenIds((prev) => [...prev, menuId]);
  };

  const handleMouseLeave = (menuId: string) => {
    const timeout = setTimeout(() => {
      setOpenIds((prev) => prev.filter((id) => id !== menuId));
    }, 200);
    setHoverTimeout(timeout);
  };

  const setMenuRef = (element: HTMLDivElement | null, id: string) => {
    menuRefs.current[id] = element;
  };

  return (
    <div
      className={`${
        isMobile ? "flex flex-col gap-1" : "flex items-center gap-6"
      }`}
    >
      {visibleMenus.map((menu) => {
        const hasChildren =
          Array.isArray(menu.subcategories) && menu.subcategories.length > 0;
        const isActive = pathname === `/product/category/${menu.name}`;

        return (
          <div
            key={menu._id}
            ref={(el) => setMenuRef(el, menu._id)}
            className={`relative ${isMobile ? "" : "group"}`}
            onMouseEnter={() =>
              !isMobile && hasChildren && handleMouseEnter(menu._id)
            }
            onMouseLeave={() =>
              !isMobile && hasChildren && handleMouseLeave(menu._id)
            }
          >
            <button
              onClick={() => handleCategoryClick(menu)}
              className={`flex items-center text-lg font-normal transition-colors py-2 rounded-lg ${
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-800 hover:text-blue-700"
              }`}
            >
              {menu.name}
              {hasChildren && !isMobile && (
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform ${
                    openIds.includes(menu._id) ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {hasChildren && !isMobile && (
              <div
                className={`absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 p-3 min-w-[220px] rounded-lg shadow-lg transition-all duration-200 ${
                  openIds.includes(menu._id)
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-1"
                }`}
                onMouseEnter={() => handleMouseEnter(menu._id)}
                onMouseLeave={() => handleMouseLeave(menu._id)}
              >
                <SubCategoryList
                  subcategories={menu.subcategories}
                  parentPath={`/${menu.name}`}
                />
              </div>
            )}

            {hasChildren && isMobile && (
              <SubCategoryList
                subcategories={menu.subcategories}
                isMobile
                parentPath={`/${menu.name}`}
              />
            )}
          </div>
        );
      })}

      {remainingMenus.length > 0 && (
        <div
          ref={moreMenuRef}
          className={`relative ${isMobile ? "" : "ml-auto"}`}
        >
          <button
            onClick={() => setMoreOpen((prev) => !prev)}
            className="flex items-center gap-1.5 text-blue-700 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            More
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                moreOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {moreOpen && (
            <div
              className={`${
                isMobile
                  ? "ml-3 mt-1 pl-3"
                  : "absolute right-0 top-full mt-2 z-50 bg-white border border-gray-200 p-3 min-w-[200px] rounded-lg shadow-lg"
              } flex flex-col gap-1`}
            >
              {remainingMenus.map((menu) => {
                const hasChildren =
                  Array.isArray(menu.subcategories) &&
                  menu.subcategories.length > 0;
                const isActive = pathname === `/product/category/${menu.name}`;

                return (
                  <div
                    key={menu._id}
                    className="relative group"
                    onMouseEnter={() =>
                      !isMobile && hasChildren && handleMouseEnter(menu._id)
                    }
                    onMouseLeave={() =>
                      !isMobile && hasChildren && handleMouseLeave(menu._id)
                    }
                  >
                    <button
                      onClick={() => handleCategoryClick(menu)}
                      className={`flex items-center justify-between w-full text-left px-2 py-1.5 rounded-md font-medium transition-colors ${
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-800 hover:text-blue-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{menu.name}</span>
                      {hasChildren && !isMobile && (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {hasChildren && openIds.includes(menu._id) && !isMobile && (
                      <div
                        className="absolute left-full top-0 ml-1 z-50 bg-white border border-gray-200 p-3 min-w-[200px] rounded-lg shadow-lg"
                        onMouseEnter={() => handleMouseEnter(menu._id)}
                        onMouseLeave={() => handleMouseLeave(menu._id)}
                      >
                        <SubCategoryList
                          subcategories={menu.subcategories}
                          parentPath={`/${menu.name}`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

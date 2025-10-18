"use client";

import { useEffect, useState } from "react";
import { Edit2, Plus, Save, X, Trash2 } from "lucide-react";
import { useCategories } from "@/lib/queries/query";
import {
  addSizeAction,
  deleteSizeAction,
  getSizesAction,
  updateSizeAction
} from "@/lib/actions/sizeAction";
import { CategoryT } from "@/types";

interface SizeT {
  _id: string;
  name: string;
  category: { _id: string; name: string };
}

export default function SizePage() {
  const [sizes, setSizes] = useState<SizeT[]>([]);
  const [newSize, setNewSize] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingSize, setEditingSize] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [editCategories, setEditCategories] = useState<{
    [key: string]: string;
  }>({});
  const { data: categories } = useCategories();
  const [loading, setLoading] = useState(false);

  /* -------------------- 📥 Fetch sizes -------------------- */
  useEffect(() => {
    (async () => {
      const res = await getSizesAction();
      if (res.success) setSizes(res.data);
    })();
  }, []);

  /* -------------------- ➕ Add new size -------------------- */
  const handleAddSize = async () => {
    if (!newSize.trim() || !selectedCategory) return;

    const formData = new FormData();
    formData.append("name", newSize);
    formData.append("categoryId", selectedCategory);

    setLoading(true);
    const res = await addSizeAction(formData);
    setLoading(false);

    if (res.success && res.data) {
      setSizes((prev) => [...prev, res.data]);
      setNewSize("");
      setSelectedCategory("");
    } else {
      alert(res.message);
    }
  };

  /* -------------------- ✏️ Start editing -------------------- */
  const startEditSize = (size: SizeT) => {
    setEditingSize(size._id);
    setEditValues({ [size._id]: size.name });
    setEditCategories({ [size._id]: size.category._id });
  };

  /* -------------------- 💾 Save edit -------------------- */
  const handleSaveEdit = async (id: string) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", editValues[id]);
    formData.append("categoryId", editCategories[id]);

    setLoading(true);
    const res = await updateSizeAction(formData);
    setLoading(false);

    if (res.success && res.data) {
      setSizes((prev) => prev.map((s) => (s._id === id ? res.data : s)));
      setEditingSize(null);
    } else {
      alert(res.message);
    }
  };

  /* -------------------- 🗑️ Delete size -------------------- */
  const handleDeleteSize = async (id: string) => {
    if (!confirm("Are you sure you want to delete this size?")) return;

    const formData = new FormData();
    formData.append("id", id);

    setLoading(true);
    const res = await deleteSizeAction(formData);
    setLoading(false);

    if (res.success) {
      setSizes((prev) => prev.filter((s) => s._id !== id));
    } else {
      alert(res.message);
    }
  };

  /* -------------------- 🧩 UI -------------------- */
  return (
    <div className="bg-white  rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Sizes</h2>

      {/* Add new size */}
      <div className="flex flex-col gap-4 mb-4">
        <input
          type="text"
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          placeholder="Enter size name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-main"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-main"
        >
          <option value="">Select a category</option>
          {categories?.map((c: CategoryT) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAddSize}
          disabled={loading || !newSize.trim() || !selectedCategory}
          className="flex items-center justify-center gap-2 py-2 rounded-md bg-main text-white font-medium transition-all hover:bg-[#e25a20] disabled:bg-gray-400"
        >
          <Plus size={18} />
          {loading ? "Adding..." : "Add Size"}
        </button>
      </div>

      {/* Size list */}
      <div className="space-y-2 h-[20rem] overflow-y-scroll scrollbar-hide">
        {sizes?.map((size) => (
          <div
            key={size._id}
            className="flex items-center gap-2 p-2 border border-gray-200 rounded-md"
          >
            {editingSize === size._id ? (
              <>
                <input
                  type="text"
                  value={editValues[size._id] || ""}
                  onChange={(e) =>
                    setEditValues({ ...editValues, [size._id]: e.target.value })
                  }
                  className="flex-1 px-1 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-main"
                />
                <select
                  value={editCategories[size._id] || ""}
                  onChange={(e) =>
                    setEditCategories({
                      ...editCategories,
                      [size._id]: e.target.value
                    })
                  }
                  className="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-main"
                >
                  {categories?.map((c:CategoryT) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleSaveEdit(size._id)}
                  className="p-1 text-green-600 hover:text-green-800"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => setEditingSize(null)}
                  className="p-1 text-gray-600 hover:text-gray-800"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">{size.name}</span>
                <span className="text-sm text-gray-500">
                  ({size.category.name})
                </span>
                <button
                  onClick={() => startEditSize(size)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteSize(size._id)}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

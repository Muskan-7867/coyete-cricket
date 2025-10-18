"use client";

import { useEffect, useState } from "react";
import { Edit2, Plus, Save, X, Trash2 } from "lucide-react";
import { addColorAction, deleteColorAction, getColorsAction, updateColorAction } from "@/lib/actions/colorActions";


type ColorT = {
  _id: string;
  name: string;
};

export default function Color() {
  const [colors, setColors] = useState<ColorT[]>([]);
  const [newColor, setNewColor] = useState("");
  const [editingColor, setEditingColor] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ------------------ Fetch colors on load ------------------ */
  useEffect(() => {
    (async () => {
      const res = await getColorsAction();
      if (res.success) setColors(res.data);
    })();
  }, []);

  /* ------------------ Add color ------------------ */
  const addColor = async () => {
    if (!newColor.trim()) return;

    const formData = new FormData();
    formData.append("name", newColor);

    setIsSubmitting(true);
    const res = await addColorAction(formData);
    setIsSubmitting(false);

    if (res.success && res.data) {
      setColors((prev) => [...prev, res.data]);
      setNewColor("");
    } else {
      alert(res.message);
    }
  };

  /* ------------------ Delete color ------------------ */
  const deleteColorHandler = async (id: string) => {
    if (!confirm("Are you sure you want to delete this color?")) return;

    const formData = new FormData();
    formData.append("id", id);

    setIsSubmitting(true);
    const res = await deleteColorAction(formData);
    setIsSubmitting(false);

    if (res.success) {
      setColors((prev) => prev.filter((c) => c._id !== id));
    } else {
      alert(res.message);
    }
  };

  /* ------------------ Edit color ------------------ */
  const startEditColor = (color: ColorT) => {
    setEditingColor(color._id);
    setEditValues({ ...editValues, [color._id]: color.name });
  };

  const saveEditColor = async (id: string) => {
    const newName = editValues[id];
    if (!newName.trim()) return;

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", newName);

    setIsSubmitting(true);
    const res = await updateColorAction(formData);
    setIsSubmitting(false);

    if (res.success && res.data) {
      setColors((prev) => prev.map((c) => (c._id === id ? res.data : c)));
      setEditingColor(null);
    } else {
      alert(res.message);
    }
  };

  const cancelEditColor = (id: string) => {
    setEditingColor(null);
    const newEditValues = { ...editValues };
    delete newEditValues[id];
    setEditValues(newEditValues);
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="bg-white rounded-lg h-fit shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Colors</h2>

      {/* Add new color */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          placeholder="Add new color"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-main"
          onKeyDown={(e) => e.key === "Enter" && !isSubmitting && addColor()}
          disabled={isSubmitting}
        />
        <button
          onClick={addColor}
          disabled={!newColor.trim() || isSubmitting}
          className="px-4 py-2 bg-main text-white rounded-md hover:bg-main/60 disabled:bg-gray-400 flex items-center gap-1"
        >
          <Plus size={16} />
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </div>

      {/* Color list */}
      <div className="space-y-2 h-[20rem] overflow-y-scroll scrollbar-hide">
        {colors.map((color) => (
          <div
            key={color._id}
            className="flex items-center gap-2 p-2 border border-gray-200 rounded-md"
          >
            {editingColor === color._id ? (
              <>
                <input
                  type="text"
                  value={editValues[color._id] || ""}
                  onChange={(e) =>
                    setEditValues({ ...editValues, [color._id]: e.target.value })
                  }
                  className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-main"
                  onKeyDown={(e) => e.key === "Enter" && saveEditColor(color._id)}
                  disabled={isSubmitting}
                />
                <button
                  onClick={() => saveEditColor(color._id)}
                  disabled={isSubmitting}
                  className="p-1 text-green-600 hover:text-green-800 disabled:text-gray-400"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => cancelEditColor(color._id)}
                  disabled={isSubmitting}
                  className="p-1 text-gray-600 hover:text-gray-800 disabled:text-gray-400"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">{color.name}</span>
                <button
                  onClick={() => startEditColor(color)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteColorHandler(color._id)}
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


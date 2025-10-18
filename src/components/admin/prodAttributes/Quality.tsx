"use client";

import { addQualityAction, deleteQualityAction, updateQualityAction } from "@/lib/actions/qualityActions";
import { Edit2, Plus, Save, Trash2, X } from "lucide-react";
import React, { useState } from "react";

type QualityT = {
  _id: string;
  name: string;
};

export default function Quality() {
  const [qualities, setQualities] = useState<QualityT[]>([]);
  const [newQuality, setNewQuality] = useState("");
  const [editingQuality, setEditingQuality] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuality = async () => {
    if (!newQuality.trim()) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", newQuality);

    const res = await addQualityAction(formData);
    if (res.success) {
      setQualities((prev) => [
        ...prev,
        { _id: Date.now().toString(), name: newQuality },
      ]);
      setNewQuality("");
    } else {
      alert(res.message);
    }
    setIsSubmitting(false);
  };

  const saveEditQuality = async (id: string) => {
    if (!editValues[id]?.trim()) return;
    setIsSubmitting(true);

    const res = await updateQualityAction(id, editValues[id]);
    if (res.success) {
      setQualities((prev) =>
        prev.map((q) => (q._id === id ? { ...q, name: editValues[id] } : q))
      );
      setEditingQuality(null);
    } else {
      alert(res.message);
    }

    setIsSubmitting(false);
  };

  const handleDeleteQuality = async (id: string) => {
    setIsSubmitting(true);
    const res = await deleteQualityAction(id);
    if (res.success) {
      setQualities((prev) => prev.filter((q) => q._id !== id));
    } else {
      alert(res.message);
    }
    setIsSubmitting(false);
  };

  const startEditQuality = (quality: QualityT) => {
    setEditingQuality(quality._id);
    setEditValues({ ...editValues, [quality._id]: quality.name });
  };

  const cancelEditQuality = (id: string) => {
    setEditingQuality(null);
    const newEditValues = { ...editValues };
    delete newEditValues[id];
    setEditValues(newEditValues);
  };

  return (
    <div className="bg-white h-fit rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Qualities</h2>

      {/* Add new quality */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newQuality}
          onChange={(e) => setNewQuality(e.target.value)}
          placeholder="Add new quality"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
          onKeyDown={(e) => e.key === "Enter" && addQuality()}
          disabled={isSubmitting}
        />
        <button
          onClick={addQuality}
          disabled={!newQuality.trim() || isSubmitting}
          className="px-4 py-2 bg-main text-white rounded-md hover:bg-main/60 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <Plus size={16} />
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </div>

      {/* Quality list */}
      <div className="space-y-2 h-[20rem] overflow-y-scroll scrollbar-hide">
        {qualities.map((quality) => (
          <div
            key={quality._id}
            className="flex items-center gap-2 p-2 border border-gray-200 rounded-md"
          >
            {editingQuality === quality._id ? (
              <>
                <input
                  type="text"
                  value={editValues[quality._id] || ""}
                  onChange={(e) =>
                    setEditValues({ ...editValues, [quality._id]: e.target.value })
                  }
                  className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-main"
                  onKeyDown={(e) => e.key === "Enter" && saveEditQuality(quality._id)}
                  disabled={isSubmitting}
                />
                <button
                  onClick={() => saveEditQuality(quality._id)}
                  disabled={isSubmitting}
                  className="p-1 text-main hover:text-green-800 disabled:text-gray-400"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => cancelEditQuality(quality._id)}
                  disabled={isSubmitting}
                  className="p-1 text-gray-600 hover:text-gray-800 disabled:text-gray-400"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">{quality.name}</span>
                <button
                  onClick={() => startEditQuality(quality)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteQuality(quality._id)}
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

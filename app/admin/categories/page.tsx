"use client";

import { useState } from "react";

const initialCategories = [
  { id: "1", name: "Electronics", icon: "📱", updated: "2023-10-26 14:30" },
  { id: "2", name: "Books", icon: "📚", updated: "2023-10-25 10:00" },
  { id: "3", name: "Fashion", icon: "👗", updated: "2023-10-24 16:15" },
  { id: "4", name: "Home & Kitchen", icon: "🏠", updated: "2023-10-23 09:45" },
  { id: "5", name: "Sports & Outdoors", icon: "🏃‍♂️", updated: "2023-10-22 11:20" },
];

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("🏃‍♂️");
  const [search, setSearch] = useState("");

  const handleAddCategory = () => {
    if (!newName.trim()) return;
    const newCategory = {
      id: Date.now().toString(),
      name: newName,
      icon: newIcon,
      updated: new Date().toISOString().slice(0, 16).replace("T", " "),
    };
    setCategories([newCategory, ...categories]);
    setNewName("");
    setNewIcon("🏃‍♂️");
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A]">
      <section className="px-8 py-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Category Management</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Add Category */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <input
                type="text"
                placeholder="e.g., Electronics, Books, Fashion"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Icon</label>
              <select
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md text-sm"
              >
                <option value="📱">Electronics</option>
                <option value="📚">Books</option>
                <option value="👗">Fashion</option>
                <option value="🏠">Home & Kitchen</option>
                <option value="🏃‍♂️">Activity</option>
              </select>
            </div>
            <button
              onClick={handleAddCategory}
              className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium"
            >
              Add Category
            </button>
          </div>

          {/* Search & Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Search & Filter</h3>
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-4 px-4 py-3 border border-[#E5E5E5] rounded-md text-sm"
            />
            <select className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md text-sm">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Archived</option>
            </select>
          </div>
        </div>

        {/* Category List */}
        <h3 className="text-lg font-semibold mb-4">Category List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-[#E5E5E5]">
            <thead className="bg-[#F5F5F5]">
              <tr>
                <th className="text-left p-3">ICON</th>
                <th className="text-left p-3">CATEGORY NAME</th>
                <th className="text-left p-3">LAST UPDATED</th>
                <th className="text-left p-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cat) => (
                <tr key={cat.id} className="border-t">
                  <td className="p-3 text-lg">{cat.icon}</td>
                  <td className="p-3">{cat.name}</td>
                  <td className="p-3">{cat.updated}</td>
                  <td className="p-3 space-x-2">
                    <button className="text-[#34967C] font-medium">Edit</button>
                    <button
                      className="text-red-500 font-medium"
                      onClick={() => handleDelete(cat.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <p className="text-sm text-[#7E7B7B] mt-4">
          Showing 1–{filtered.length} of {categories.length} categories
        </p>
      </section>
    </main>
  );
}
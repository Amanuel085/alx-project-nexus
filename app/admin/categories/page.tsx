"use client";

import { useEffect, useMemo, useState } from "react";

type Category = { id: number; name: string; slug: string };

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load categories");
      setCategories(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load categories");
    }
  };

  useEffect(() => { load(); }, []);

  const handleAddCategory = async () => {
    setMessage(null);
    setError(null);
    if (!newName.trim()) return;
    try {
      const slug = slugify(newName);
      const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newName.trim(), slug }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to create category");
      setNewName("");
      setMessage("Category created");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create category");
    }
  };

  const handleDelete = async (id: number) => {
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to delete category");
      setMessage("Category deleted");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete category");
    }
  };

  const filtered = useMemo(() => categories.filter((cat) => cat.name.toLowerCase().includes(search.toLowerCase())), [categories, search]);

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A]">
      <section className="px-8 py-12 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Category Management</h2>
          <button onClick={() => history.back()} className="text-sm text-[#34967C] underline">Back</button>
        </div>
        {message && <p className="text-green-600 mb-4 text-sm">{message}</p>}
        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Add Category */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <input
                type="text"
                placeholder="e.g., Technology, Sports"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md text-sm"
              />
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
            <p className="text-xs text-[#7E7B7B]">Use the search to filter categories.</p>
          </div>
        </div>

        {/* Category List */}
        <h3 className="text-lg font-semibold mb-4">Category List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-[#E5E5E5]">
            <thead className="bg-[#F5F5F5]">
              <tr>
                <th className="text-left p-3">CATEGORY NAME</th>
                <th className="text-left p-3">SLUG</th>
                <th className="text-left p-3">LAST UPDATED</th>
                <th className="text-left p-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cat) => (
                <tr key={cat.id} className="border-t">
                  <td className="p-3">{cat.name}</td>
                  <td className="p-3">{cat.slug}</td>
                  <td className="p-3">—</td>
                  <td className="p-3 space-x-2">
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
        <p className="text-sm text-[#7E7B7B] mt-4">Showing 1–{filtered.length} of {categories.length} categories</p>
      </section>
    </main>
  );
}
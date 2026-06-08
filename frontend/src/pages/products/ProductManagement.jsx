import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Optional but recommended
import "react-toastify/dist/ReactToastify.css";

const ProductManagement = () => {
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState(["piece", "kg", "pack", "Box", "Meter"]);

  // UI States
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    unit: "",
    _id: null,
  });
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/products", authHeader);
      // Ensures products is always an array
      const data = res.data.products || (Array.isArray(res.data) ? res.data : []);
      setProducts(data);
    } catch (err) {
      console.error("Fetch Products Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories", authHeader);
      const cats = Array.isArray(res.data) ? res.data : res.data.categories || [];
      setCategories(cats);
    } catch (err) {
      console.error("Fetch Categories Error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Form Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form._id) {
        await axios.put(`http://localhost:5000/api/products/${form._id}`, form, authHeader);
        toast.success("Product updated!");
      } else {
        await axios.post("http://localhost:5000/api/products", form, authHeader);
        toast.success("Product added!");
      }
      setForm({ name: "", category: "", price: "",unit: "", _id: null });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category?._id || p.category || "",
      price: p.price,
      unit: p.unit,
      _id: p._id,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, authHeader);
      toast.success("Deleted successfully");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Filter Logic (Safeguarded)
  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = safeProducts
    .filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (filterCategory ? p.category?._id === filterCategory : true));

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Product Management</h1>
          <p className="text-gray-500">Add, edit, and track store products.</p>
        </header>

        {/* --- FORM SECTION --- */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
            {form._id ? "📝 Edit Product" : "➕ Add New Product"}
          </h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="Ex: Wireless Mouse"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Unit</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                required
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">Select Unit</option>
                {units.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className={`w-full py-2.5 rounded-lg font-semibold text-white transition shadow-md ${
                  form._id ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                }`}
              >
                {form._id ? "Update Product" : "Save Product"}
              </button>
            </div>
          </form>
        </div>

        {/* --- SEARCH & FILTERS --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1); // Reset page on filter
            }}
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Product Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Pricing</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {displayedProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{p.name}</div>
                      <div className="text-xs text-gray-400">ID: {p._id?.slice(-6)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        {p.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-gray-200 font-semibold">₹{p.price}</div>
                      <div className="text-xs text-gray-400">per {p.unit}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(p)}
                          className="text-blue-500 hover:text-blue-700 text-sm font-medium transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {displayedProducts.length === 0 && !loading && (
            <div className="p-12 text-center text-gray-500">
              <div className="text-4xl mb-2">📦</div>
              <p>No products match your search criteria.</p>
            </div>
          )}
        </div>

        {/* --- PAGINATION --- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-2">
            <p className="text-sm text-gray-500">
              Showing page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                    currentPage === num
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default ProductManagement;
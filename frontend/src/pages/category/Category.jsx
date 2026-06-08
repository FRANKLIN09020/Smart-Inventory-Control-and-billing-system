import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Tags, Plus, Pencil, Trash2, FolderTree, 
  CheckCircle2, XCircle, Search, AlertCircle 
} from "lucide-react";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5000/api/categories";
  const headers = { Authorization: `Bearer ${token}` };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL, { headers });
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = { name, parent: parent || null, isActive };
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload, { headers });
        setMessage({ type: "success", text: "Category updated successfully!" });
      } else {
        await axios.post(API_URL, payload, { headers });
        setMessage({ type: "success", text: "New category created!" });
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setParent(cat.parent?._id || "");
    setIsActive(cat.isActive);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This may affect products linked to this category.")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, { headers });
      fetchCategories();
      setMessage({ type: "success", text: "Category deleted." });
    } catch (err) {
      setMessage({ type: "error", text: "Cannot delete: Category might be in use." });
    }
  };

  const resetForm = () => {
    setName("");
    setParent("");
    setIsActive(true);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
              <Tags size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Category</h1>
              <p className="text-slate-500 text-sm font-medium">Define your product hierarchy</p>
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
          }`}>
            <AlertCircle size={18} />
            <span className="font-bold text-sm">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: ADD/EDIT FORM --- */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 sticky top-8">
              <h2 className="text-lg font-bold mb-6 text-slate-800">
                {editingId ? "Update Category" : "Create New Category"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Name</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. Smartwatches"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Parent (For Sub-category)</label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    value={parent}
                    onChange={(e) => setParent(e.target.value)}
                  >
                    <option value="">None (Top Level)</option>
                    {categories.filter(c => c._id !== editingId).map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-slate-600 uppercase">Status</span>
                  <button 
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className="flex items-center gap-2"
                  >
                    {isActive ? (
                      <CheckCircle2 className="text-emerald-500" />
                    ) : (
                      <XCircle className="text-slate-300" />
                    )}
                    <span className={`text-xs font-black uppercase ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {isActive ? 'Active' : 'Hidden'}
                    </span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? "Processing..." : editingId ? "Save Changes" : <><Plus size={18} /> Create Category</>}
                </button>

                {editingId && (
                  <button type="button" onClick={resetForm} className="w-full text-xs font-bold text-slate-400 hover:text-slate-600">
                    Cancel and Create New
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* --- RIGHT: CATEGORY LIST --- */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search categories..."
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Structure</th>
                    <th className="px-6 py-4">Parent</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((cat) => (
                    <tr key={cat._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${cat.isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                            <FolderTree size={16} />
                          </div>
                          <span className={`font-bold ${cat.isActive ? 'text-slate-800' : 'text-slate-400 italic line-through'}`}>
                            {cat.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {cat.parent ? (
                          <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase">
                            {cat.parent.name}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300">MAIN</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(cat)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors hover:bg-white rounded-lg border border-transparent hover:border-slate-100">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(cat._id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors hover:bg-white rounded-lg border border-transparent hover:border-slate-100">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {categories.length === 0 && (
                <div className="p-12 text-center text-slate-400 text-sm font-medium italic">
                  No categories found. Start by adding one on the left.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
import { useEffect, useState } from "react";
import { 
  Package, 
  ArrowUpRight, 
  ArrowDownLeft, 
  AlertCircle, 
  Search, 
  RefreshCcw,
  Layers
} from "lucide-react";
import { getProducts } from "../../api/product.api";
import { addStock, removeStock, getInventory } from "../../api/inventory.api";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("IN");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data.products || []);
    } catch (err) { console.error("Product fetch error:", err); }
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await getInventory();
      // Ensure we are accessing the correct path based on your backend res.status(200).json({ inventory: items });
      setInventory(res.data.inventory || []);
    } catch (err) { 
      console.error("Inventory fetch error:", err); 
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchProducts();
    fetchInventory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic frontend validation
    if (!productId) return setError("Please select a product");
    if (!quantity || quantity <= 0) return setError("Please enter a valid quantity");

    try {
      // DATA OBJECT: Matches backend controller keys precisely
      const payload = { 
        product: productId, 
        quantity: Number(quantity) 
      };

      if (type === "IN") {
        await addStock(payload);
      } else {
        await removeStock(payload);
      }

      setSuccess(`Stock ${type === 'IN' ? 'added' : 'removed'} successfully`);
      setProductId("");
      setQuantity("");
      fetchInventory(); // Refresh the table
    } catch (err) {
      // Catch the "product and quantity are required" error from backend if keys are wrong
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Stock Control</h1>
            <p className="text-slate-500 font-medium">Manage warehouse levels and movement history</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchInventory}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* --- QUICK STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            label="Total Items" 
            value={inventory.reduce((acc, curr) => acc + (curr.quantity || 0), 0)} 
            icon={<Layers className="text-blue-600" />}
            bgColor="bg-blue-50"
          />
          <StatCard 
            label="Low Stock Alert" 
            value={inventory.filter(i => i.quantity <= (i.lowStockThreshold || 5)).length} 
            icon={<AlertCircle className="text-rose-600" />}
            bgColor="bg-rose-50"
            isAlert={inventory.filter(i => i.quantity <= (i.lowStockThreshold || 5)).length > 0}
          />
          <StatCard 
            label="Active SKUs" 
            value={inventory.length} 
            icon={<Package className="text-emerald-600" />}
            bgColor="bg-emerald-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- STOCK ACTION FORM --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">Update Inventory</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="p-3 text-sm bg-rose-50 text-rose-600 rounded-xl border border-rose-100">{error}</div>}
                {success && <div className="p-3 text-sm bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">{success}</div>}

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Select Product</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none"
                  >
                    <option value="">Choose item...</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Action</label>
                    <div className="flex p-1 bg-slate-100 rounded-2xl">
                      <button 
                        type="button"
                        onClick={() => setType("IN")}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${type === "IN" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
                      >
                        STOCK IN
                      </button>
                      <button 
                        type="button"
                        onClick={() => setType("OUT")}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${type === "OUT" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500"}`}
                      >
                        STOCK OUT
                      </button>
                    </div>
                  </div>
                  <div className="w-1/3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                    type === "IN" ? "bg-indigo-600 shadow-indigo-100" : "bg-rose-600 shadow-rose-100"
                  }`}
                >
                  {type === "IN" ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                  Confirm Movement
                </button>
              </form>
            </div>
          </div>

          {/* --- INVENTORY LIST --- */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search inventory by product name..."
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[2rem] shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4">Item Details</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Available Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredInventory.map((item) => {
                    // Logic check for low stock
                    const isLow = item.quantity <= (item.lowStockThreshold || 5);
                    return (
                      <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className={`mx-auto w-2.5 h-2.5 rounded-full ${isLow ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{item.product?.name || "Product Info Missing"}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {item._id.slice(-6).toUpperCase()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase">
                            {item.product?.category?.name || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className={`text-lg font-black ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>
                            {item.quantity}
                            <span className="text-[10px] ml-1 text-slate-400 font-medium tracking-normal italic uppercase">
                               {item.product?.unit || "pcs"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, bgColor, isAlert }) => (
  <div className={`p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex items-center gap-5 ${isAlert ? 'ring-2 ring-rose-500 ring-offset-2' : ''}`}>
    <div className={`p-4 rounded-2xl ${bgColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

export default Inventory;
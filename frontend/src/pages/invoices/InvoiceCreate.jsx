import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Receipt, User, Plus, Trash2, Search, 
  Calculator, CheckCircle, X, Clock, ExternalLink 
} from "lucide-react";

const Billing = () => {
  // --- States ---
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [items, setItems] = useState([{ product: "", name: "", quantity: 1, price: 0, total: 0 }]);
  const [taxPercent, setTaxPercent] = useState(18);
  const [status, setStatus] = useState("Paid");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // --- Load Data (Form + List) ---
  const loadData = async () => {
    try {
      const [custRes, prodRes, invRes] = await Promise.all([
        axios.get("http://localhost:5000/api/customers", { headers }),
        axios.get("http://localhost:5000/api/products", { headers }),
        axios.get("http://localhost:5000/api/invoices", { headers })
      ]);
      setCustomers(custRes.data);
      setProducts(prodRes.data.products || prodRes.data);
      const sortedInvoices = (invRes.data.invoices || invRes.data).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentInvoices(sortedInvoices.slice(0, 5));
    } catch (err) {
      console.error("Data Load Error", err);
    }
  };

  useEffect(() => { loadData(); }, []);

  // --- Calculations ---
  const subTotal = items.reduce((acc, item) => acc + item.total, 0);
  const totalAmount = subTotal + (subTotal * Number(taxPercent)) / 100;

  // --- Handlers ---
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    if (field === "product") {
      const p = products.find(prod => prod._id === value);
      if (p) {
        newItems[index] = { ...newItems[index], product: p._id, name: p.name, price: p.price };
      }
    } else {
      newItems[index][field] = value;
    }
    newItems[index].total = Number(newItems[index].quantity) * Number(newItems[index].price);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return setMessage({ type: "error", text: "Please select a customer first!" });
    
    setLoading(true);
    try {
      const payload = {
        customer: selectedCustomer._id,
        items: items.map(i => ({ product: i.product, quantity: i.quantity, price: i.price })),
        taxPercent: Number(taxPercent),
        status: status
      };
      await axios.post("http://localhost:5000/api/invoices", payload, { headers });
      setMessage({ type: "success", text: "Invoice Generated Successfully!" });
      
      // Refresh list & Reset Form
      loadData();
      setItems([{ product: "", name: "", quantity: 1, price: 0, total: 0 }]);
      setSelectedCustomer(null);
      setCustomerSearch("");
    } catch (err) {
      setMessage({ type: "error", text: "Failed to generate invoice" });
    } finally { setLoading(false); }
  };

  // --- EDIT STATUS: UNPAID TO PAID ---
  const handleUpdateStatus = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/invoices/${id}`, { status: "Paid" }, { headers });
      setMessage({ type: "success", text: "Invoice marked as Paid!" });
      loadData(); // Refresh history list
    } catch (err) {
      setMessage({ type: "error", text: "Status update failed" });
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#FDFDFF] p-6 lg:p-10 font-sans custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* SECTION 1: HEADER & BILLING FORM */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-[#5B49CF] rounded-3xl text-white shadow-xl">
              <Receipt size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#0F172A]">New Invoice</h1>
              <p className="text-slate-400 font-medium">Generate ₹ Quick Bill</p>
            </div>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center justify-between font-bold text-xs border ${
              message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
            }`}>
              <span>{message.text}</span>
              <X size={14} className="cursor-pointer" onClick={() => setMessage({type:"", text:""})} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Input Fields */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Customer</p>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" placeholder="Type name or phone..." value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#5B49CF] outline-none font-bold"
                  />
                  {customerSearch && !selectedCustomer && (
                    <div className="absolute z-20 w-full mt-2 bg-white border rounded-2xl shadow-2xl max-h-40 overflow-y-auto">
                      {customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())).map(c => (
                        <div key={c._id} onClick={() => {setSelectedCustomer(c); setCustomerSearch(c.name);}} className="p-4 hover:bg-indigo-50 cursor-pointer font-bold border-b">{c.name}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-8 py-5">Product</th>
                      <th className="px-8 py-5 text-center">Qty</th>
                      <th className="px-8 py-5">Price</th>
                      <th className="px-8 py-5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b border-slate-50 last:border-0">
                        <td className="px-8 py-4">
                          <select value={item.product} onChange={(e) => updateItem(index, "product", e.target.value)} className="w-full p-2 bg-slate-50 rounded-xl font-bold border-none outline-none">
                            <option value="">Select Product...</option>
                            {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                          </select>
                        </td>
                        <td className="px-8 py-4">
                           <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} className="w-16 mx-auto p-2 bg-slate-50 rounded-xl text-center font-bold border-none outline-none" />
                        </td>
                        <td className="px-8 py-4 font-bold text-slate-600">₹{item.price}</td>
                        <td className="px-8 py-4 text-right font-black text-[#5B49CF]">₹{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" onClick={() => setItems([...items, { product: "", name: "", quantity: 1, price: 0, total: 0 }])} className="w-full py-5 text-[#5B49CF] font-black text-xs hover:bg-indigo-50 transition-colors border-t border-dashed border-slate-100">
                  + Add Another Item
                </button>
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-[#2D248A] text-white p-10 rounded-[3rem] shadow-2xl space-y-8">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300 opacity-60">Order Summary</h2>
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between text-indigo-100"><span>Subtotal</span><span>₹{subTotal}</span></div>
                  <div className="flex justify-between items-center text-indigo-100">
                    <span>GST %</span>
                    <input type="number" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} className="w-12 bg-indigo-900/50 rounded p-1 text-center outline-none border-none" />
                  </div>
                  <div className="flex justify-between text-indigo-100"><span>Tax Amount</span><span>₹{(subTotal * taxPercent) / 100}</span></div>
                </div>
                
                <div className="pt-8 border-t border-indigo-500/30">
                  <p className="text-[10px] font-black uppercase text-indigo-300 mb-2">Grand Total</p>
                  <p className="text-5xl font-black">₹{totalAmount.toLocaleString()}</p>
                </div>

                <div className="space-y-4">
                   <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-indigo-900/50 p-4 rounded-2xl font-bold text-sm border-none outline-none cursor-pointer">
                      <option value="Paid">Mark as Paid</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Draft">Save Draft</option>
                   </select>
                   <button type="submit" disabled={loading} className="w-full py-5 bg-white text-[#5B49CF] rounded-2xl font-black shadow-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                      {loading ? "Processing..." : <><Calculator size={20}/> Generate Invoice</>}
                   </button>
                </div>
              </div>
            </div>
          </form>
        </section>

        {/* SECTION 2: RECENT TRANSACTIONS (SCROLL DOWN TO SEE) */}
        <section className="pb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-slate-100 rounded-2xl text-slate-500"><Clock size={20} /></div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Recent Transactions</h2>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Invoice #</th>
                  <th className="px-8 py-5">Customer</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentInvoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="px-8 py-5 text-slate-500 font-medium">{inv.customer?.name || "Walking Customer"}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-black text-slate-900">₹{inv.totalAmount.toLocaleString()}</td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end items-center gap-3">
                         {inv.status === "Unpaid" && (
                           <button 
                            onClick={() => handleUpdateStatus(inv._id)}
                            className="text-[10px] font-black uppercase bg-emerald-600 text-white px-3 py-1.5 rounded-xl hover:bg-emerald-700 shadow-sm transition-all"
                           >
                             Mark Paid
                           </button>
                         )}
                         <button className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-[#5B49CF] transition-colors">
                            <ExternalLink size={16} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentInvoices.length === 0 && (
              <div className="p-10 text-center text-slate-400 font-bold">No recent invoices found.</div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Billing;
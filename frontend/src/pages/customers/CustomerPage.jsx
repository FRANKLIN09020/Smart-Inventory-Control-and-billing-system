import React, { useState, useEffect } from "react";
import { 
  Users, Search, UserPlus, Mail, Phone, MapPin, 
  Edit2, Trash2, Filter, Download,
  CheckCircle2, XCircle, RefreshCcw, X, IndianRupee
} from "lucide-react";
import api from "../../utils/axios"; 

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const [formData, setFormData] = useState({ 
    name: "", email: "", phone: "", address: "",isActive: true 
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleEdit = (customer) => {
    setIsEditing(true);
    setCurrentCustomerId(customer._id);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || "",
      isActive: customer.isActive ?? true
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentCustomerId(null);
    setFormData({ name: "", email: "", phone: "", address: "", isActive: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure creditLimit is sent as a number
      const dataToSubmit = {
        ...formData,
        creditLimit: Number(formData.creditLimit)
      };

      if (isEditing) {
        await api.put(`/customers/${currentCustomerId}`, dataToSubmit);
      } else {
        await api.post("/customers", dataToSubmit);
      }
      handleCloseModal();
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving customer");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/customers/${id}`);
        setCustomers(customers.filter(c => c._id !== id));
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customer Directory</h1>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200"
          >
            <UserPlus size={18} /> Add New Customer
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Clients" value={customers.length} icon={<Users className="text-indigo-600" />} color="bg-indigo-50" />
          <StatCard label="Active Accounts" value={customers.filter(c => c.isActive).length} icon={<CheckCircle2 className="text-emerald-600" />} color="bg-emerald-50" />
          <StatCard label="Blocked/Inactive" value={customers.filter(c => !c.isActive).length} icon={<XCircle className="text-rose-600" />} color="bg-rose-50" />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between bg-white">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or phone..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={fetchCustomers} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all">
                <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-8 py-5">Customer</th>
                  <th className="px-8 py-5">Contact Details</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="px-8 py-5 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold uppercase">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{customer.name}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 uppercase font-medium">
                            <MapPin size={10} /> {customer.address || "No address"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs">
                       <div className="font-medium text-slate-600">{customer.email}</div>
                       <div className="text-slate-400">{customer.phone}</div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${customer.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {customer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(customer)} className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                          <Edit2 size={16}/>
                        </button>
                        <button onClick={() => handleDelete(customer._id)} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={handleCloseModal} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600"><X size={20}/></button>
            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">
              {isEditing ? "Update Customer" : "Add New Customer"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Full Name</label>
                 <input type="text" required value={formData.name} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Email</label>
                   <input type="email" value={formData.email} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Phone</label>
                   <input type="text" value={formData.phone} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Address</label>
                 <textarea value={formData.address} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" rows="2" onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              
              <div className="flex items-center gap-2 px-2">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  checked={formData.isActive} 
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-slate-600 uppercase">Account Active</label>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all mt-4">
                {isEditing ? "Save Changes" : "Create Profile"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm">
    <div className={`p-4 rounded-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

export default Customers;
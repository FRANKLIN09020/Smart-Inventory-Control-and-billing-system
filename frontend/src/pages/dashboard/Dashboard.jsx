import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios'; // Using the axios.js file you shared
import { 
  IndianRupee, Package, Users, Receipt, 
  AlertTriangle, ArrowRight, RefreshCcw, LayoutDashboard
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    todaysSales: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalInvoices: 0,
    lowStockItems: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetching from your dashboard endpoint
      const response = await api.get('/dashboard');
      
      // axios.js interceptor returns 'res', so we access .data
      setStats(response.data);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
      setError("Unable to sync dashboard data. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <RefreshCcw className="animate-spin text-indigo-600 mx-auto mb-4" size={40} />
        <p className="font-bold text-slate-500 text-xs uppercase tracking-widest">Loading Analytics...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
              <LayoutDashboard className="text-indigo-600" /> Overview
            </h1>
            <p className="text-slate-500 font-medium text-sm">Real-time status of your inventory and sales</p>
          </div>
          <button 
            onClick={() => navigate('/billing')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            <Receipt size={18}/> New Invoice
          </button>
        </div>

        {/* --- KPI Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            icon={<IndianRupee/>} 
            label="Today's Sales" 
            value={`₹${stats.todaysSales?.toLocaleString('en-IN')}`} 
            color="emerald" 
          />
          <StatCard 
            icon={<AlertTriangle/>} 
            label="Low Stock Alert" 
            value={stats.lowStockItems?.length || 0} 
            color="rose" 
            isAlert={stats.lowStockItems?.length > 0}
          />
          <StatCard 
            icon={<Package/>} 
            label="Total SKUs" 
            value={stats.totalProducts} 
            color="indigo" 
          />
          <StatCard 
            icon={<Users/>} 
            label="Customers" 
            value={stats.totalCustomers} 
            color="blue" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Low Stock List (The logic you were missing) --- */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="font-black text-slate-800 flex items-center gap-3">
                <AlertTriangle className="text-rose-500" size={20} /> Critical Stock Levels
              </h2>
              {stats.lowStockItems?.length > 0 && (
                <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-3 py-1 rounded-full">
                  ACTION REQUIRED
                </span>
              )}
            </div>
            
            <div className="p-8">
              {stats.lowStockItems?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="pb-4">Product Name</th>
                        <th className="pb-4">Current Qty</th>
                        <th className="pb-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {stats.lowStockItems.map((item) => (
                        <tr key={item._id} className="group hover:bg-slate-50 transition-colors">
                          <td className="py-4">
                            <p className="font-bold text-slate-700">{item.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase">{item.category}</p>
                          </td>
                          <td className="py-4 font-black text-rose-500 text-lg">
                            {item.stockQuantity} 
                            <span className="ml-1 text-[10px] text-slate-300">PCS</span>
                          </td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => navigate('/inventory')}
                              className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
                            >
                              Restock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={30} />
                  </div>
                  <p className="text-slate-400 font-bold italic">All inventory levels are optimal.</p>
                </div>
              )}
            </div>
          </div>

          {/* --- Navigation Panel --- */}
          <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
               <h3 className="text-indigo-400 text-[10px] font-black uppercase mb-2">System Insights</h3>
               <p className="text-sm leading-relaxed text-slate-300 relative z-10">
                 There are <b>{stats.lowStockItems?.length}</b> items below your threshold. 
                 Updating your stock now prevents "Out of Stock" errors during billing.
               </p>
               <div className="absolute -right-4 -bottom-4 text-white/5">
                 <LayoutDashboard size={120} />
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-800 mb-6 text-xs uppercase tracking-widest">Quick Links</h3>
              <div className="space-y-3">
                <ShortcutBtn label="Inventory" onClick={() => navigate('/inventory')} />
                <ShortcutBtn label="Customers" onClick={() => navigate('/customers')} />
                <ShortcutBtn label="Reports" onClick={() => navigate('/reports')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ icon, label, value, color, isAlert }) => {
  const themes = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100"
  };

  return (
    <div className={`bg-white p-8 rounded-[2.5rem] border shadow-sm transition-all ${isAlert ? 'border-rose-200 ring-2 ring-rose-50' : 'border-slate-100'}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${themes[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className={`text-3xl font-black tracking-tighter ${isAlert ? 'text-rose-600' : 'text-slate-900'}`}>
        {value}
      </h3>
    </div>
  );
};

const ShortcutBtn = ({ label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-bold text-sm group text-slate-600"
  >
    {label}
    <ArrowRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-all" />
  </button>
);

export default Dashboard;
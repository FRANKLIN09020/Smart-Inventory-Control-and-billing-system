import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  TrendingUp, Package, Calendar, 
  Loader2, RefreshCcw, AlertCircle, 
  FileStack, Box, Search, Table
} from "lucide-react";
import * as XLSX from 'xlsx';

const Reports = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const today = new Date().toLocaleDateString('en-CA'); 
  const [dates, setDates] = useState({ start: today, end: today });

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: activeTab === 'sales' ? { startDate: dates.start, endDate: dates.end } : {}
      };
      const res = await axios.get(`http://localhost:5000/api/reports/${activeTab}`, config);
      setReportData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Connection to server failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [activeTab]);

  // --- FULL DATA EXCEL EXPORT ---
  const exportToExcel = () => {
    if (!reportData) return alert("No data to export");
    const fileName = `Full_Inventory_Report_${activeTab}_${today}`;
    
    let flatData = [];

    if (activeTab === 'sales' && reportData.invoices) {
      // mapping based on your DB image (image_618fe2.png)
      flatData = reportData.invoices.map(inv => ({
        "Invoice ID": inv._id,
        "Invoice Number": inv.invoiceNumber,
        "Customer Name": inv.customer?.name || 'Walk-in',
        "Sub Total": inv.subTotal,
        "Tax (%)": inv.taxPercent,
        "Tax Amount": inv.taxAmount,
        "Total Amount": inv.totalAmount,
        "Status": inv.status,
        "Created At": new Date(inv.createdAt).toLocaleString(),
        "Updated At": new Date(inv.updatedAt).toLocaleString()
      }));
    } else {
      const stockList = Array.isArray(reportData) ? reportData : (reportData.inventoryStatus || []);
      flatData = stockList.map(item => ({
        "Product ID": item._id,
        "Product Name": item.name,
        "Category": item.category,
        "Stock Quantity": item.stockQuantity,
        "Price": item.price,
        "Status": item.stockQuantity < 10 ? 'Low Stock' : 'Available'
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Full Report");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Analytics</h1>
            <p className="text-slate-500 font-medium">Full business performance reports</p>
          </div>
          
          <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200">
            <button 
              onClick={() => setActiveTab('sales')}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'sales' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <TrendingUp size={16}/> Sales
            </button>
            <button 
              onClick={() => setActiveTab('stock')}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'stock' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Package size={16}/> Stock
            </button>
          </div>
        </div>

        {/* ACTIONS BAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2 flex flex-wrap items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm">
            {activeTab === 'sales' ? (
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl flex-1">
                <Calendar size={18} className="text-indigo-600" />
                <input type="date" value={dates.start} onChange={e => setDates({...dates, start: e.target.value})} className="bg-transparent font-bold text-sm outline-none" />
                <span className="text-slate-300">to</span>
                <input type="date" value={dates.end} onChange={e => setDates({...dates, end: e.target.value})} className="bg-transparent font-bold text-sm outline-none" />
              </div>
            ) : (
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search records..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 bg-slate-50 rounded-2xl font-bold text-sm outline-none"
                />
              </div>
            )}
            <button onClick={fetchReport} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm active:scale-95 transition-all">
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> Update
            </button>
          </div>

          <button 
            onClick={exportToExcel} 
            className="flex items-center justify-center gap-3 bg-emerald-600 text-white p-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg active:scale-95 transition-all"
          >
            <Table size={20} /> Export Full Data to Excel
          </button>
        </div>

        {/* CONTENT AREA */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-center gap-4 text-rose-600 mb-6">
            <AlertCircle /> <p className="font-bold">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p className="font-bold animate-pulse">Fetching Database Records...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {activeTab === 'sales' ? <SalesDisplay data={reportData} /> : <StockDisplay data={reportData} searchTerm={searchTerm} />}
          </div>
        )}
      </div>
    </div>
  );
};

// --- DISPLAY COMPONENTS ---
const SalesDisplay = ({ data }) => {
  if (!data || !data.invoices || data.invoices.length === 0) return <EmptyState icon={<FileStack size={48}/>} message="No sales found." />;
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50 border-b border-slate-200">
          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <th className="px-8 py-5">Customer</th>
            <th className="px-8 py-5">Date</th>
            <th className="px-8 py-5 text-right">Amount (INR)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.invoices.map(inv => (
            <tr key={inv._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-8 py-5 font-bold text-slate-800">{inv.customer?.name || 'Walk-in'}</td>
              <td className="px-8 py-5 text-sm text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
              <td className="px-8 py-5 text-right font-black text-slate-900">₹{inv.totalAmount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StockDisplay = ({ data, searchTerm }) => {
  const stockList = useMemo(() => {
    const list = Array.isArray(data) ? data : (data.inventoryStatus || []);
    return list.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm]);

  if (stockList.length === 0) return <EmptyState icon={<Box size={48}/>} message="No matching items." />;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stockList.map(item => (
        <div key={item._id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900">{item.name}</h3>
          <p className="text-xs font-bold text-slate-400 uppercase mb-4">{item.category}</p>
          <div className="text-3xl font-black text-indigo-600">{item.stockQuantity} <span className="text-sm text-slate-400 font-bold">units</span></div>
        </div>
      ))}
    </div>
  );
};

const EmptyState = ({ icon, message }) => (
  <div className="bg-white rounded-[3rem] p-20 border border-slate-200 border-dashed text-center w-full">
    <div className="inline-block p-6 bg-slate-50 text-slate-300 rounded-full mb-4">{icon}</div>
    <p className="text-slate-500 font-bold">{message}</p>
  </div>
);

export default Reports;
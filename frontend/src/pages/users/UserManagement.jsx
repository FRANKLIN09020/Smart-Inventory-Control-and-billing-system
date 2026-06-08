import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Pencil, 
  Trash2, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  User, 
  Search, 
  UserCog,
  X,
  RefreshCcw
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MANAGER");
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5000/api/users";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("MANAGER");
    setEditingUser(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingUser) {
        await axios.put(
          `${API_URL}/${editingUser._id}`,
          { username, email, password: password || undefined, role },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Profile updated successfully");
      } else {
        await axios.post(
          API_URL,
          { username, email, password, role },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("User added to the team");
      }
      resetForm();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUsername(user.username);
    setEmail(user.email);
    setRole(user.role);
    setPassword("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- NEW: DELETE FUNCTION ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("User removed successfully");
      setUsers(users.filter(u => u._id !== id));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed. Check permissions.");
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200",
      MANAGER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200",
      CASHIER: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200",
    };
    return styles[role] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 p-4 md:p-8 text-slate-900 dark:text-slate-100 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
              <UserCog className="text-indigo-600" size={32} />
              Team Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Manage permissions and team members</p>
          </div>
          <button onClick={fetchUsers} className="p-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- USER FORM --- */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-gray-800 sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                {editingUser ? "Edit Member" : "Add Member"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="p-4 text-xs bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-100 dark:border-rose-800 animate-in fade-in duration-300">{error}</div>}
                {success && <div className="p-4 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-800 animate-in fade-in duration-300">{success}</div>}

                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text" placeholder="Full Name" value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    required
                  />
                </div>

                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="email" placeholder="Email Address" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    required
                  />
                </div>

                <div className="relative group">
                  <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="MANAGER">Manager</option>
                    <option value="CASHIER">Cashier</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className="relative group">
                   <input
                    type="password"
                    placeholder={editingUser ? "New Password (Optional)" : "Password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    {...(!editingUser && { required: true })}
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {editingUser ? "Save Changes" : <><UserPlus size={18} /> Invite Member</>}
                  </button>
                  {editingUser && (
                    <button
                      type="button" onClick={resetForm}
                      className="w-full py-3 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* --- USER LIST --- */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="Search team members by name or email..."
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-slate-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-gray-800/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100 dark:border-gray-800">
                    <th className="px-8 py-5">User Info</th>
                    <th className="px-8 py-5 text-center">Role</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-gray-800">
                  {users
                    .filter(u => 
                      u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      u.email.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((u) => (
                      <tr key={u._id} className="group hover:bg-slate-50/80 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 dark:text-slate-200">{u.username}</div>
                              <div className="text-xs text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getRoleBadge(u.role)}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEdit(u)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-gray-600"
                              title="Edit User"
                            >
                              <Pencil size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(u._id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-gray-600"
                              title="Delete User"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {users.length === 0 && !loading && (
                <div className="p-20 text-center">
                  <div className="inline-block p-4 rounded-full bg-slate-50 dark:bg-gray-800 text-slate-300 mb-4">
                    <User size={40} />
                  </div>
                  <p className="text-slate-400 font-medium">No users found in the system</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserManagement;
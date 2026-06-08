import api from "../utils/axios";


export const getDashboardStats = () => api.get("/dashboard");
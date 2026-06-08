import api from "../utils/axios";

export const login = (data) => api.post("/auth/login", data);

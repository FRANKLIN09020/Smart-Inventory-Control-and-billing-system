import api from "../utils/axios";

export const createInvoice = (data) => api.post("/invoices", data);

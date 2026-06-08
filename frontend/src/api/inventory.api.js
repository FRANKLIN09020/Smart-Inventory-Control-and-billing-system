import api from "../utils/axios";

// Get full inventory
export const getInventory = () => api.get("/inventory");

// Stock IN
export const addStock = (data) =>
  api.post("/inventory/add", data);

// Stock OUT
export const removeStock = (data) =>
  api.post("/inventory/remove", data);

// Low stock alerts
export const getLowStock = () =>
  api.get("/inventory");

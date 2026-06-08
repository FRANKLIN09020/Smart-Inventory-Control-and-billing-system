const Customer = require("./customer.model");

// Add new customer
const createCustomer = async (data) => {
  const customer = new Customer(data);
  return await customer.save();
};

// Update customer
const updateCustomer = async (customerId, data) => {
  const customer = await Customer.findByIdAndUpdate(
    customerId,
    { ...data, updatedAt: Date.now() },
    { new: true }
  );
  if (!customer) throw new Error("Customer not found");
  return customer;
};

// Get all customers
const getCustomers = async () => {
  return await Customer.find().sort({ createdAt: -1 });
};

// Get customer by ID
const getCustomerById = async (customerId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new Error("Customer not found");
  return customer;
};

/**
 * NEW: Delete customer logic
 */
const deleteCustomer = async (customerId) => {
  const customer = await Customer.findByIdAndDelete(customerId);
  if (!customer) throw new Error("Customer not found");
  return customer;
};

module.exports = {
  createCustomer,
  updateCustomer,
  getCustomers,
  getCustomerById,
  deleteCustomer 
};
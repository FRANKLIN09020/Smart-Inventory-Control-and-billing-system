const customerService = require("./customer.service");

// Create customer
const createCustomer = async (req, res) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json({ message: "Customer created", customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    res.status(200).json({ message: "Customer updated", customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all customers
const getCustomers = async (req, res) => {
  try {
    const customers = await customerService.getCustomers();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single customer
const getCustomerById = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * NEW: Delete customer controller
 */
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await customerService.deleteCustomer(id);
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    // If permission middleware fails, it won't even reach here.
    // If it reaches here and fails, it's a database or ID issue.
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCustomer,
  updateCustomer,
  getCustomers,
  getCustomerById,
  deleteCustomer // <--- Ensure this is exported
};
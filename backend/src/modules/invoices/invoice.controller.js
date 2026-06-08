const invoiceService = require("./invoice.service");

const createInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.createInvoice(req.body);
    res.status(201).json({ message: "Invoice created", invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.getInvoices();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- NEW CONTROLLER UPDATE ---
const updateInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
    res.status(200).json({ message: "Invoice updated", invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createInvoice, getInvoices, getInvoiceById, updateInvoice };
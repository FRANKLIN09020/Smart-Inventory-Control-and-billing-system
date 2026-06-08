const Invoice = require("./invoice.model");
const Product = require("../products/product.model");
const Customer = require("../customers/customer.model");
const mongoose = require("mongoose");

const generateInvoiceNumber = async () => {
  const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
  if (!lastInvoice) return "INV-1001";
  const parts = lastInvoice.invoiceNumber.split("-");
  const lastNumber = parseInt(parts[1]);
  return `INV-${lastNumber + 1}`;
};

const createInvoice = async (data) => {
  if (!data.customer) throw new Error("Customer ID is required");
  if (!data.items || !data.items.length) throw new Error("At least one item is required");

  const customerExists = await Customer.findById(data.customer);
  if (!customerExists) throw new Error("Customer not found");

  const invoiceNumber = await generateInvoiceNumber();
  let calculatedSubTotal = 0;

  const processedItems = await Promise.all(
    data.items.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) throw new Error(`Product not found: ${item.product}`);
      const unitPrice = item.price > 0 ? Number(item.price) : Number(product.price);
      const quantity = Number(item.quantity);
      if (quantity <= 0) throw new Error(`Invalid quantity`);
      const itemTotal = unitPrice * quantity;
      calculatedSubTotal += itemTotal;
      return { product: product._id, quantity, price: unitPrice, total: itemTotal };
    })
  );

  const taxPercent = Number(data.taxPercent) || 0;
  const taxAmount = (calculatedSubTotal * taxPercent) / 100;
  const totalAmount = calculatedSubTotal + taxAmount;

  const invoice = new Invoice({
    invoiceNumber,
    customer: data.customer,
    items: processedItems,
    subTotal: calculatedSubTotal,
    taxPercent,
    taxAmount,
    totalAmount,
    status: data.status || "Draft"
  });

  return await invoice.save();
};

const getInvoices = async () => {
  return await Invoice.find()
    .populate("customer", "name email phone")
    .populate("items.product", "name price unit")
    .sort({ createdAt: -1 });
};

const getInvoiceById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
  const invoice = await Invoice.findById(id).populate("customer").populate("items.product");
  if (!invoice) throw new Error("Invoice not found");
  return invoice;
};

// --- NEW UPDATE FUNCTION ---
const updateInvoice = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
  const updated = await Invoice.findByIdAndUpdate(
    id, 
    { $set: updateData }, 
    { new: true }
  ).populate("customer", "name");
  if (!updated) throw new Error("Invoice not found");
  return updated;
};

module.exports = { createInvoice, getInvoices, getInvoiceById, updateInvoice };
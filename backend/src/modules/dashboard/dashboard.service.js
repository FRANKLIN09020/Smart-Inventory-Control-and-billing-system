const Invoice = require("../invoices/invoice.model");
const Product = require("../products/product.model");
const Inventory = require("../inventory/inventory.model");
const Customer = require("../customers/customer.model");

const getDashboardData = async () => {
  try {
    // 1. Precise Date Range for "Today" (Local Server Time)
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // 2. Fetch Invoices for Today with valid Sales statuses
    // We include "Paid" because that's what your billing module uses now
    const todaysInvoices = await Invoice.find({
      createdAt: { $gte: start, $lte: end },
      status: { $in: ["Issued", "Paid"] } 
    }).lean();

    // 3. Calculate Total Sales Amount
    const todaysSales = todaysInvoices.reduce((acc, inv) => {
      return acc + (Number(inv.totalAmount) || 0);
    }, 0);

    // 4. Fetch Low Stock Items from Inventory Module
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ["$quantity", "$lowStockThreshold"] }
    }).populate("product").lean();

    // 5. Build Final Response Object
    return {
      todaysSales: todaysSales, // Sending as a number
      totalInvoices: todaysInvoices.length,
      totalProducts: await Product.countDocuments(),
      totalCustomers: await Customer.countDocuments(),
      lowStockItems: lowStockItems.map(item => ({
        _id: item._id,
        name: item.product?.name || "Unknown Product",
        category: "Stock Alert",
        stockQuantity: item.quantity
      })),
      lowStockCount: lowStockItems.length
    };
  } catch (error) {
    throw new Error("Dashboard Service Error: " + error.message);
  }
};

module.exports = { getDashboardData };
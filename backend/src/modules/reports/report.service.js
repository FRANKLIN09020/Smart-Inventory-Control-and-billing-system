const Invoice = require("../invoices/invoice.model");
const Product = require("../products/product.model");

/**
 * Fetches sales data based on a date range.
 * Note: We've removed the strict "status" filter to ensure you see data immediately.
 */
const getSalesReport = async (startDate, endDate) => {
  // 1. Create date objects and force them to cover the full day
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  // 2. Query MongoDB
  const invoices = await Invoice.find({
    createdAt: { $gte: start, $lte: end }
  }).populate("customer", "name email");

  // 3. Calculate total revenue
  const totalSales = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);

  // 4. Return formatted object
  return {
    totalSales,
    totalInvoices: invoices.length,
    invoices
  };
};

/**
 * Fetches all products for the stock report.
 */
const getStockReport = async () => {
  const products = await Product.find();
  return products.map((p) => ({
    _id: p._id,
    name: p.name,
    category: p.category,
    stockQuantity: p.stockQuantity,
    status: p.status,
  }));
};

// CRITICAL: We export an object containing the functions
module.exports = {
  getSalesReport,
  getStockReport
};
const ReportService = require("./report.service");

const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start and End dates are required" });
    }

    // This call MUST match the name in report.service.js exactly
    const report = await ReportService.getSalesReport(startDate, endDate);
    
    res.status(200).json(report);
  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getStockReport = async (req, res) => {
  try {
    const report = await ReportService.getStockReport();
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Exporting to be used by report.routes.js
module.exports = {
  getSalesReport,
  getStockReport
};
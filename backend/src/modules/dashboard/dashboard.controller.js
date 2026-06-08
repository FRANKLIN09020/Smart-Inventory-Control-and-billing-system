const DashboardService = require("./dashboard.service");

const getDashboardData = async (req, res) => {
  try {
    const data = await DashboardService.getDashboardData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardData };

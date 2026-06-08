const inventoryService = require("./inventory.service");



// Stock IN
const addStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !quantity) {
      return res.status(400).json({
        message: "product and quantity are required"
      });
    }

    const inventory = await inventoryService.addStock(product, quantity);
    res.status(200).json({ message: "Stock added", inventory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Stock OUT
const removeStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !quantity) {
      return res.status(400).json({
        message: "product and quantity are required"
      });
    }

    const inventory = await inventoryService.removeStock(product, quantity);
    res.status(200).json({ message: "Stock removed", inventory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Low-stock items
const getLowStockItems = async (req, res) => {
  try {
    const items = await inventoryService.getLowStockItems();
    res.status(200).json({ lowStockItems: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllInventory = async (req, res) => {
  try {
    const items = await inventoryService.getAllInventory();
    res.status(200).json({ inventory: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllInventory,
  addStock,
  removeStock,
  getLowStockItems
};

const Inventory = require("./inventory.model");
const Product = require("../products/product.model");

const addStock = async (product, quantity) => {
  if (!product || quantity <= 0) {
    throw new Error("Valid product and quantity required");
  }

  const productExists = await Product.findById(product);
  if (!productExists) throw new Error("Product not found");

  let inventory = await Inventory.findOne({ product });

  if (!inventory) {
    inventory = await Inventory.create({
      product,
      quantity
    });
  } else {
    inventory.quantity += quantity;
    await inventory.save();
  }

  return inventory;
};

const removeStock = async (product, quantity) => {
  if (!product || quantity <= 0) {
    throw new Error("Valid product and quantity required");
  }

  const inventory = await Inventory.findOne({ product });
  if (!inventory) throw new Error("Inventory not found");

  if (inventory.quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  inventory.quantity -= quantity;
  await inventory.save();

  return inventory;
};

const getAllInventory = async () => {
  return Inventory.find().populate({
    path: "product",
    populate: { path: "category" }
  });
};


const getLowStockItems = async () => {
  return Inventory.find({
    $expr: { $lte: ["$quantity", "$lowStockThreshold"] }
  }).populate({
    path: "product",
    populate: {
      path: "category"
    }
  });
};

module.exports = {
  getAllInventory,
  addStock,
  removeStock,
  getLowStockItems
};

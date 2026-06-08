const Product = require("./product.model");
const Inventory = require("../inventory/inventory.model");

const getProducts = async () => {
  const products = await Product.find().populate("category");

  const productsWithStock = await Promise.all(
    products.map(async (p) => {
      const inventory = await Inventory.findOne({ product: p._id });
      return {
        ...p.toObject(),
        stock: inventory ? inventory.quantity : 0
      };
    })
  );

  return productsWithStock;
};

module.exports = {
  createProduct: async (data) => {
    const product = new Product(data);
    return await product.save();
  },
  getProducts,
  updateProduct: async (id, data) => {
    data.updatedAt = Date.now();
    return await Product.findByIdAndUpdate(id, data, { new: true });
  },
  deleteProduct: async (id) => {
    return await Product.findByIdAndDelete(id);
  },
};

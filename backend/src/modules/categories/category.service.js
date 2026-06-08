const Category = require("./category.model");

// Create new category
const createCategory = async (data) => {
  const category = new Category(data);
  return await category.save();
};

// Get all categories
const getCategories = async () => {
  return await Category.find().populate("parent");
};

// Update category
const updateCategory = async (id, data) => {
  data.updatedAt = Date.now();
  return await Category.findByIdAndUpdate(id, data, { new: true });
};

// Delete category
const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
};

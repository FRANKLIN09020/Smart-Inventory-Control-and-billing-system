const Role = require("./role.model");

const createRole = async (data) => {
  const exists = await Role.findOne({ name: data.name });
  if (exists) throw new Error("Role already exists");

  return Role.create(data);
};

const updateRole = async (id, data) => {
  return Role.findByIdAndUpdate(id, data, { new: true });
};

const getRoles = async () => {
  return Role.find();
};

module.exports = {
  createRole,
  updateRole,
  getRoles,
};

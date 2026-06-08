const Setting = require("./setting.model");

const getSettings = async () => {
  let settings = await Setting.findOne();
  if (!settings) {
    // If no settings exist, create default
    settings = await Setting.create({
      shopName: "My Shop",
      taxPercentage: 5,
      invoicePrefix: "INV",
      invoiceNumber: 1,
    });
  }
  return settings;
};

const updateSettings = async (data) => {
  const settings = await Setting.findOne();
  if (!settings) {
    return Setting.create(data);
  }
  Object.assign(settings, data);
  return settings.save();
};

module.exports = { getSettings, updateSettings };

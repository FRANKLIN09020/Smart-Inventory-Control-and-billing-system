const SettingService = require("./setting.service");

// Get current settings
const getSettings = async (req, res) => {
  try {
    const settings = await SettingService.getSettings();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    const updated = await SettingService.updateSettings(req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};

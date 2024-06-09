const Blacklist = require("../models/blacklist.model");
const Notification = require("../models/notification.model");

// Controller function to create a new blacklist entry
const createBlacklistEntry = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req?.user?._id;
    const adminId = req?.user?.admin;

    // check if IP exists on blacklist
    const exists = await Blacklist.findOne({ source_ip: req.body?.Flow?.source_ip });

    if (exists) {
      const notificationExists = await Notification.findOne({
        blacklistId: exists._id,
      });

      if (notificationExists) {
        return res.status(400).json({
          error: "Notification already exists for this blacklist entry",
        });
      }
      await Notification.create({
        title: "Blacklist Entry",
        message: "Blacklist entry already exists",
        user: userId,
        admin: adminId,
        link: "/blacklist",
        blacklist: exists._id,
      });

      return res.status(400).json({ error: "IP already exists on blacklist" });
    }
    // Create a new blacklist entry
    await Blacklist.create({
      user: userId,
      admin: adminId,
      //   source_ip: { type: String },
      //   destination_ip: { type: String },
      //   protocol: { type: String },
      //   source_port: { type: Number },
      //   destination_port: { type: Number },
    });

    res.status(200).json({ message: "Blacklist entry created" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create blacklist entry" });
  }
};

// Controller function to get blacklist by user id
const getBlacklistByUserId = async (req, res) => {
  try {
    const userId = req?.user?.admin;
    const admin = req.admin ? req.user._id : userId;
    // Find the blacklist entries by user id
    const blacklist = await Blacklist.find({ admin });

    res.status(200).json(blacklist);
  } catch (error) {
    res.status(500).json({ error: "Failed to get blacklist entry" });
  }
};

// delete Entry
const deleteBlacklistEntry = async (req, res) => {
  try {
    const blacklist = await Blacklist.findByIdAndDelete(req?.params.id);

    res.status(200).json({ message: "Blacklist entry deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blacklist entry" });
  }
};

// Export the controller functions
module.exports = {
  createBlacklistEntry,
  getBlacklistByUserId,
  deleteBlacklistEntry,
};

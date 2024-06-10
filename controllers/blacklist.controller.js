const Blacklist = require("../models/blacklist.model");
const Notification = require("../models/notification.model");
const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_ADDRESS,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// Controller function to create a new blacklist entry
const createBlacklistEntry = async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body?.Flow) {
      return res.status(400).json({ error: "Flow data is required" });
    }
    const userId = req?.user?._id;
    // const adminId = req?.user?.admin;
    // console.log(userId, adminId);

    // check if IP exists on blacklist
    const exists = await Blacklist.findOne({
      source_ip: req.body?.Flow?.source_ip,
    });

    if (exists) {
      // const notificationExists = await Notification.findOne({
      //   blacklistId: exists._id,
      // });

      // if (notificationExists) {
      //   return res.status(400).json({
      //     error: "Notification already exists for this blacklist entry",
      //   });
      // }
      // await Notification.create({
      //   title: "Blacklist Entry",
      //   message: "Blacklist entry already exists",
      //   user: userId,
      //   admin: adminId,
      //   link: "/blacklist",
      //   blacklist: exists._id,
      // });
      // const admin = await User.findById(adminId);
      // const mailOptions = {
      //   from: "safenetd@gmail.com",
      //   to: admin.email,
      //   subject: "Network Attack Detected",
      //   text: `Attack detected from IP: ${req.body?.Flow?.source_ip} of Attack Type ${req.body?.attack_type} and Mechanism: ${req.body?.mechanism}`,
      // };

      // transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log("Email sent: " + info.response);
      //   }
      // });

      return res.status(400).json({ error: "IP already exists on blacklist" });
    }
    // Create a new blacklist entry
    await Blacklist.create({
      user: userId,
      // admin: adminId,
      ...req.body?.Flow,
      attack_type: req.body?.attack_type,
      mechanism: req.body?.mechanism,
      // time: req.body?.time,
    });

    res.status(200).json({ message: "Blacklist entry created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get blacklist by user id
const getBlacklistByUserId = async (req, res) => {
  try {
    const user = req.user._id;
    // const userId = req?.user?.admin;
    // const admin = req.admin ? req.user._id : userId;
    // Find the blacklist entries by user id
    const blacklist = await Blacklist.find({ user });

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

// verify admin middleware
const verifyAdmin = async (req, res, next) => {
  try {
    // console.log(req.user);
    req.admin = req?.user.role === "admin";
    if (!req.admin) {
      return res.status(401).json({ message: "User does not have privileges" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "User does not have privileges" });
  }
};

module.exports = verifyAdmin;

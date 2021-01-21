const jwt = require("jsonwebtoken");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

exports.upload = multer({ storage });

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const auth = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = auth;
  } else {
    return res.status(400).json({ msg: "Authroization required" });
  }
  next();
};

exports.userMiddleware = (req, res, next) => {
  if (req.auth.role !== "user") {
    return res.status(400).json({ msg: "User access denied" });
  }
  next();
};

exports.adminMiddleware = (req, res, next) => {
  if (req.auth.role !== "admin") {
    return res.status(400).json({ msg: "Access denied" });
  }
  next();
};

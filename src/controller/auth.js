const Auth = require("../models/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signin = (req, res) => {
  Auth.findOne({ email: req.body.email }).exec((err, auth) => {
    if (err) {
      return res.status(400).json({ err });
    }
    if (auth) {
      if (auth.authenticate(req.body.password)) {
        const token = jwt.sign(
          { _id: auth._id, role: auth.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        const { _id, firstName, lastName, email, role, fullName } = auth;
        res.status(200).json({
          token,
          auth: {
            _id,
            firstName,
            lastName,
            email,
            role,
            fullName,
          },
        });
      } else {
        return res.status(400).json({
          msg: "Invalid password",
        });
      }
    } else {
      return res.status(400).json({
        msg: "Something went wrong",
      });
    }
  });
};

exports.signup = (req, res) => {
  Auth.findOne({
    email: req.body.email,
  }).exec(async (err, auth) => {
    if (auth) {
      return res.status(400).json({
        msg: "User already existed",
      });
    }
    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _auth = new Auth({
      firstName,
      lastName,
      email,
      hash_password,
      username: email,
    });

    _auth.save((err, data) => {
      if (err) {
        return res.status(400).json({
          msg: err,
        });
      }
      if (data) {
        return res.status(201).json({
          msg: "User created successfully",
        });
      }
    });
  });
};

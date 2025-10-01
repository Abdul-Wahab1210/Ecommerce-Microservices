import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import TokenBlacklist from "../models/TokenBlacklist.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // ✅ Check if token is blacklisted
      const blacklisted = await TokenBlacklist.findOne({ token });
      if (blacklisted) {
        return res
          .status(401)
          .json({ message: "Token has been revoked. Please log in again." });
      }

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

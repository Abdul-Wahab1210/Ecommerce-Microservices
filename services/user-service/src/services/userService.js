import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import TokenBlacklist from "../models/TokenBlacklist.js";

export const registerUser = async ({ name, email, password }) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid email or password");
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  };
};

export const getUserProfile = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};

export const logoutUser = async (token) => {
  // Decode token to get expiry date
  const decoded = jwt.decode(token);
  if (!decoded || !decoded.exp) throw new Error("Invalid token");

  const expiryDate = new Date(decoded.exp * 1000);

  await TokenBlacklist.create({
    token,
    expiresAt: expiryDate,
  });

  return { message: "User logged out successfully" };
};

export const updateUser = async (userId, updates) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Update only allowed fields
  if (updates.name) user.name = updates.name;
  if (updates.email) user.email = updates.email;
  if (updates.password) user.password = updates.password; // hashed via pre-save in model

  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id), // optionally refresh JWT
  };
};

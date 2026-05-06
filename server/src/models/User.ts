import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types";

// Interface for static/instance methods
interface IUserModel extends Model<IUser> {}

const UserSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: { type: String },
    phone: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String,
    },
    sizes: {
      chest: Number,
      waist: Number,
      hips: Number,
      shoulder: Number,
      inseam: Number,
    },
  },
  { timestamps: true },
);

// Hash password before saving
UserSchema.pre("save", async function () {
  // 'this' refers to the user document
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  // No need to call next() in an async function
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser, IUserModel>("User", UserSchema);

export default User;

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "trainer";
  phone?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  height?: number;
  weight?: number;
  fitnessGoal?: string;
  certifications?: string[];
  experience?: number;
  specializations?: string[];
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    website?: string;
  };
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "trainer"],
      default: "user",
    },
    phone: { type: String, trim: true },
    avatarUrl: { type: String },
    coverImageUrl: { type: String },
    bio: { type: String, maxlength: 500 },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    height: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
    fitnessGoal: { type: String },
    certifications: [{ type: String }],
    experience: { type: Number, min: 0 },
    specializations: [{ type: String }],
    socialLinks: {
      instagram: String,
      youtube: String,
      twitter: String,
      website: String,
    },
    location: {
      city: String,
      state: String,
      country: String,
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);

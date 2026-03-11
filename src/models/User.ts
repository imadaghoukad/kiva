import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string; // Optional because OAuth users might not have a password
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: [true, "Please provide an email for this user."],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false, // Not required for OAuth users
      select: false, // Don't return password by default
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

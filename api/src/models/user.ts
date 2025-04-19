import { Document, Schema, Types, model } from "mongoose";

/* ===================== */

export interface IUser extends Document<Types.ObjectId> {
  email: string;
  passwordHash: string;
  role: "teacher" | "student";
  fullName: string;
  isActive: boolean;
  isVerified: boolean;
  creationMethod: string; // local, google
  oauthProfileId?: string;

  /* ====== Optional profile fields ====== */

  profilePictureUrl?: string;
  bio?: string;
  gender?: "male" | "female";
  dateOfBirth?: Date;
  phoneCountryCode?: string;
  phoneNumber?: string;

  addressCountry?: string;
  addressCity?: string;
  addressArea?: string;
  addressZip?: string;


}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["teacher", "student"],
      required: true
    },

    fullName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    creationMethod: { type: String, default: "local", required: true },
    oauthProfileId: { type: String, required: false },

    /* ======= */

    profilePictureUrl: { type: String },
    bio: { type: String },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    dateOfBirth: { type: String },
    phoneCountryCode: { type: String },
    phoneNumber: { type: String },

    addressCountry: { type: String },
    addressCity: { type: String },
    addressArea: { type: String },
    addressZip: { type: String },

  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform(doc, ret, options) {
        // Remove passwordHash from any JSON response
        delete ret.passwordHash;
        return ret;
      }
    }
  }
);


userSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "teacherId",
});

userSchema.virtual("enrollments", {
  ref: "Enrollment",
  localField: "_id",
  foreignField: "studentId",
});


export const User = model("User", userSchema);

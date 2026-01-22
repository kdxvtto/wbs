import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
  {
    nik : {
      type : String,
      unique : true,
      sparse : true
    },
    name: {
      type: String,
      required: true,
    },
    username : {
      type : String,
      unique : true,
      sparse : true
    },
    email: {
      type: String,
      unique: true,
      sparse : true
    },
    password: {
      type: String,
      required: true,
    },
    phone : {
      type : String,
      unique : true,
      sparse : true
    },
    role : {
      type : String,
      enum : ["Admin", "Pimpinan", "Staf", "Nasabah"],
      default : "Nasabah"
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (this.isModified("password") || this.isNew) {
    if (!this.password || this.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    const saltRounds = parseInt(process.env.SALT_ROUND, 10) || 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
  }
});

userSchema.pre("findOneAndUpdate", async function () {
  if (this._update.password) {
    if (this._update.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    const saltRounds = parseInt(process.env.SALT_ROUND, 10) || 10;
    const hashedPassword = await bcrypt.hash(this._update.password, saltRounds);
    this._update.password = hashedPassword;
  }
});

userSchema.index({ refreshToken: 1 })

export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  config: {
    type: {
      sessionDuration: {
        type: Number,
        default: 60,
      },
      cooldownDuration: {
        type: Number,
        default: 0,
      },
    },
    required: true,
  },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;

import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  responseTime: {
    type: [Number],
    required: true,
  },
  avgResponseTime: {
    type: Number,
    required: true,
  },
  sessionDuration: {
    type: Number,
    required: true,
  },
  cooldownDuration: {
    type: Number,
    required: true,
  },
});

const sessionModel = mongoose.model("Session", sessionSchema);

export default sessionModel;

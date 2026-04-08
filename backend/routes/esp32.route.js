import { Router } from "express";

import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";

function calculateNextCooldown(oldSessions, newSession, curDelay) {
  const sum = oldSessions.reduce((acc, cur) => acc + cur.avgResponseTime, 0);
  const avg = sum / oldSessions.length;
  
  if (newSession.avgResponseTime > avg) {
    return curDelay + 200;
  } else {
    return curDelay - 200;
  }
}

const esp32Router = Router();

esp32Router.get("/config", async (request, response) => {
  try {
    const user = await userModel.findOne();

    return response.status(200).json({
      success: true,
      message: "Successfully retrived the session duration",
      sessionDuration: user.config.sessionDuration,
      cooldownDuration: user.config.cooldownDuration,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

esp32Router.post("/save-session-result", async (request, response) => {
  try {
    const {
      score,
      avgResponseTime,
      responseTime,
      sessionDuration,
      cooldownDuration,
    } = request.body;

    if (
      score == null ||
      avgResponseTime == null ||
      !Array.isArray(responseTime) ||
      sessionDuration == null ||
      cooldownDuration == null
    ) {
      return response.status(400).json({
        success: true,
        message: "Required fields missing",
      });
    }

    const user = await userModel.findOne();
    const oldSessions = await sessionModel.find({ userId: user._id }).limit(5);

    const payload = {
      userId: user._id,
      score,
      avgResponseTime,
      responseTime,
      sessionDuration,
      cooldownDuration,
    };

    const newSession = new sessionModel(payload);
    await newSession.save();

    user.config.cooldownDuration = calculateNextCooldown(
      oldSessions,
      newSession,
      user.config.cooldownDuration,
    );
    user.save();

    return response.status(201).json({
      success: true,
      message: "Successfully saved the session result",
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export default esp32Router;

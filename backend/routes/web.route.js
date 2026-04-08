import { Router } from "express";

import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";

const webRouter = Router();

webRouter.get("/user", async (request, response) => {
  try {
    const user = await userModel.findOne();

    return response.status(200).json({
      success: true,
      message: "Successfully retrived the user data",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

webRouter.get("/session-results", async (request, response) => {
  try {
    let { range } = request.query;
    if (range == null) range = 30;

    const user = await userModel.findOne();
    const sessions = await sessionModel.find({ userId: user._id }).limit(range);

    return response.status(200).json({
      success: true,
      message: "Successfully retrived the session results",
      data: sessions,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export default webRouter;

import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { hashPassword } from "../utils/password.js";



const hashPasswordMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const { password } = req.body;

    const hashedPassword = await hashPassword(password);

    req.body.hashed_password = hashedPassword;

    req.body.password = undefined;

    next();
  } catch (err) {
    next(err);
  }
};

const verifyAccount: RequestHandler = async (req, res, next) => {
  if (!process.env.APP_SECRET) {
    throw new Error("Vous n'avez pas configuré votre APP SECRET dans le .env");
  }

  try {
    const { auth } = req.cookies;

    if (!auth) {
      res.sendStatus(403);
    }

    const resultPayload = await jwt.verify(auth, process.env.APP_SECRET);

    if (typeof resultPayload !== "object") {
      throw new Error("Token invalid");
    }
    if (resultPayload.role === "company") {
      req.company = { id: resultPayload.id };
    }

    next();
  } catch (error) {
    next(error);
  }
};


export default { hashPassword: hashPasswordMiddleware, verifyAccount };

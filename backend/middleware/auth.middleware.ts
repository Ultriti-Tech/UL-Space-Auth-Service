import { NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { internalError } from "../Module/Auth-Service/Service/Error.service";

declare global {
  namespace Express {
    interface Request {
      id?: string;
      email?: string;
      role?: String;
    }
  }
}

export const isAunthenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // here it is useful ofr gateway api 
    const authHeader = req.headers.authorization;

    console.log("HR Authorization:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized, token not available",
        error: "Unauthorized, token not available",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized, token not available",
        error: "Unauthorized, token not available",
        success: false,
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.secretKey!,
    ) as any;

    req.id = decoded.user_id;
    req.email = decoded.email;
    req.role = decoded.role;

    next();

  } catch (error: any) {
    console.log("HR authentication error:", error);

    if (error?.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired, login again",
        message: error.message,
        success: false,
      });
    }

    if (error?.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token",
        message: "Unauthorized, token is invalid",
        success: false,
      });
    }

    return res.status(500).json({
      error: error?.message,
      message: "Authentication failed",
      success: false,
    });
  }
};

// internal service route
export const internalSeviceRoute = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serviceKey = req.headers["x-internal-service-key"];

    if (!serviceKey || serviceKey !== process.env.INTERNAL_SERVICE_KEY) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized service",
      });
    }
    next();
  } catch (error: any) {
    console.log('error', error)
    return internalError(error, req, res);
  }
};

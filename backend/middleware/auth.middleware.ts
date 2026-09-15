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
    const token = req.cookies.ulSpaceToken || req.headers["ulSpaceToken"];
    console.log('token auth :-', token )

    if (!token) {
      return res.status(401).json({
        message: "unauthorized, token not avalble",
        error: "unauthorized, token not avalble",
        success: false,
      });
    } else {
      const decoded = jwt.verify(token, `${process?.env?.secretKey}`) as any;
      if (!decoded) {
        res.status(401).json({
          message: "unauthorized, token is invalid",
          error: "unauthorized, token is invalid",
          success: false,
        });
      }
      req.id = decoded.user_id;
      req.email = decoded.email;
      req.role = decoded.role;

      next();
    }
  } catch (error: any) {
    console.log("error", error);

    if (error?.name === "TokenExpiredError") {
      return res.status(401).json({
        error: `token expired login again`,
        message: `${error?.message}`,
        success: false,
      });
    }

    return res
      .status(404)
      .json({ err: error?.message, message: error?.message, success: false });
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

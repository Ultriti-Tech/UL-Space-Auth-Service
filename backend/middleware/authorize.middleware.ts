import { NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/sqldb";

declare global {
  namespace Express {
    interface Request {
      id?: string;
      email?: string;
      permission?: String;
    }
  }
}

export const Authorize = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.id;

      if (!user_id) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const result = await pool.query(
        `
        SELECT DISTINCT p.name
        FROM user_roles ur
        JOIN role_permissions rp
         ON rp.role_id = ur.role_id
        JOIN permissions p
         ON p.id = rp.permission_id
        WHERE ur.user_id = $1 
        `,
        [user_id],
      );

      console.log('result', result?.rows)

      if (result?.rows?.length === 0) {
        return res.status(400).json({
          message: "unable to excess to the database",
          success: false,
        });
      }

      const permission = result?.rows?.map((row: any) => row.name);

      if (!permission.includes(requiredPermission)) {
        return res.status(403).json({
          message: "You do not have permission to perform this action",
          success: true,
        });
      }

      next();
    } catch (error: any) {
      console.log("error", error);

      return res
        .status(404)
        .json({
          err: error?.message,
          message: "Authontication failed !",
          success: false,
        });
    }
  };
};

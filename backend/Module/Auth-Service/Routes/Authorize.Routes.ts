import express, { Request, Response } from "express";
import {
  createUser,
  editUserDetail,
  getQualifiedCandidates,
  getUserDetail,
  loginUser,
} from "../Controller/Auth.Controller";
import {
  internalSeviceRoute,
  isAunthenticateUser,
} from "../../../middleware/auth.middleware";
import { getUserPermission } from "../../../middleware/authorize.middleware";
import { pool } from "../../../config/sqldb";

const router = express.Router();

router.get("/permission/:user_id", internalSeviceRoute, getUserPermission);
router.get("/permission/:user_id", internalSeviceRoute, getUserPermission);

export default router;

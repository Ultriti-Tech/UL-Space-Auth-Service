import express from "express";
import {
  createUser,
  editUserDetail,
  getQualifiedCandidates,
  getUserDetail,
  loginUser,
} from "../Controller/Auth.Controller";
import { isAunthenticateUser } from "../../../middleware/auth.middleware";
import { Authorize } from "../../../middleware/authorize.middleware";

const router = express.Router();

router.post("/createUser", Authorize("users.create"), createUser);
router.post("/loginUser", loginUser);

router.get(
  "/getUserDetail",
  isAunthenticateUser,
  Authorize("users.read"),
  getUserDetail,
);
// router.put("/editUserDetail/:userId",isAunthenticateUser,editUserDetail);
router.put(
  "/editUserDetail/:userId",
  isAunthenticateUser,
  Authorize("users.update"),
  editUserDetail,
);

// hr database
router.get(
  "/getQualifiedCandidates",
  isAunthenticateUser,
  Authorize("users.read"),
  getQualifiedCandidates,
);

export default router;

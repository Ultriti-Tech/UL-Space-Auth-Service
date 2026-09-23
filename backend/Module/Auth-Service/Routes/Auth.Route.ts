import express from "express";
import {
  createUser,
  editUserDetail,
  getQualifiedCandidates,
  getUserDetail,
  loginUser,
  registerIntern
} from "../Controller/Auth.Controller";
import { isAunthenticateUser } from "../../../middleware/auth.middleware";
import { Authorize } from "../../../middleware/authorize.middleware";

const router = express.Router();

router.post("/createUser", createUser);
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

// hr database
router.post(
  "/registerIntern/:interview_id",
  isAunthenticateUser,
  Authorize("users.create"),
  registerIntern,
);



export default router;

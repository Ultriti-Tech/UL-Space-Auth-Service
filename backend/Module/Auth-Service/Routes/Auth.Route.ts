import express from "express";
import { createUser, editUserDetail, getUserDetail, loginUser } from "../Controller/Auth.Controller";
import { isAunthenticateUser } from "../../../middleware/auth.middleware";

const router = express.Router();

router.post("/createUser", createUser);
router.post("/loginUser", loginUser);

router.get("/getUserDetail",isAunthenticateUser,getUserDetail);
router.put("/editUserDetail/:userId",isAunthenticateUser,editUserDetail);

router.put("/editUserDetail/:userId",isAunthenticateUser,editUserDetail);


export default router;
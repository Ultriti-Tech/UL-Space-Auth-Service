import express, { Request, Response } from "express";
import { pool, pool_Hr } from "./config/sqldb.ts";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import user from "./Module/Auth-Service/Routes/Auth.Route";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL_2,
      process.env.FRONTEND_URL_3,
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "message sent",
  });
});

// ping test
app.get("/ping", async (req, res) => {
  try {
    const result = await pool_Hr.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'",
    );
    // console.log(result.rows);

    console.log("result ---", result);
    res.send("Connected!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Not connected");
  }
});


// ------------------------
// auth route 
app.use("/api/user/", user);


app.listen(process.env.PORT, () => {
  console.log("Server running on port 3002");
});

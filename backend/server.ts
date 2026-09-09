import express, { Request, Response } from "express";
// import pool, { pool_Hr } from "./config/sqldb.ts";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// import user from "./Modules/Auth-Service/Routes/Auth.Route.ts";
import candidate from "./Modules/hr-internship-service/Routes/Candidate.route.js";
import application from "./Modules/hr-internship-service/Routes/Application.route.js";
import interview from "./Modules/hr-internship-service/Routes/Interview.route.js";
import offerLetter from "./Modules/hr-internship-service/Routes/OfferLetter.route.ts";

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

// hr routes
// app.use("/api/hr/candidate/", candidate);
// app.use("/api/hr/Application/", application);
// app.use("/api/hr/interview/", interview);
// app.use("/api/hr/offer-letter/", offerLetter);

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

app.listen(3002, () => {
  console.log("Server running on port 3001");
});

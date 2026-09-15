import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// const pool = new Pool({
//   host: "localhost",
//   user: "postgres",
//   password: "1234",
//   port: 5432,
//   database: process.env.DB_NAME || "ultriti_auth",
// });

// const pool_Hr = new Pool({
//   host: "localhost",
//   user: "postgres",
//   password: "1234",
//   port: 5432,
//   database: process.env.DB_NAME_HR || "ul_Space_HR",
// });

// const testConnection = async (): Promise<void> => {
//   try {
//     const result = await pool.query("SELECT NOW()");
//     const result_hr = await pool_Hr.query("SELECT NOW()");

//     console.log("✅ Connected to PostgreSQL:", result.rows[0].now);
//     console.log("✅ Connected to PostgreSQL:", result_hr.rows[0].now);
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("❌ Database connection error:", error.message);
//     } else {
//       console.error("❌ Database connection error:", error);
//     }
//   }
// };

// testConnection();


const pool = new Pool({
    connectionString: process.env.NEON_AUTH_DB_AUTH,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on("connect", () => {
    console.log("Connected to Neon PostgreSQL - AUTH");
});

pool.on("error", (err:any) => {
    console.error("Unexpected PostgreSQL error:", err);
});


const pool_Hr = new Pool({
    connectionString: process.env.NEON_AUTH_DB_HR,
    ssl: {
        rejectUnauthorized: false
    }
});

pool_Hr.on("connect", () => {
    console.log("Connected to Neon PostgreSQL - HR ");
});

pool_Hr.on("error", (err:any) => {
    console.error("Unexpected PostgreSQL error:", err);
});

export { pool, pool_Hr };

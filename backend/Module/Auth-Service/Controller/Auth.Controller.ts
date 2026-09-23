import { Request, Response } from "express";
import { pool, pool_Hr } from "../../../config/sqldb";
import {
  passwordHash,
  jwtSign,
  setCookies,
  comparePassword,
} from "../Service/Auth.service";
import { internalError } from "../Service/Error.service";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import { sendInternshipPortalCredentialsEmail } from "../Service/Email.service";

const db = pool as typeof pool & {
  query: (text: string, values?: unknown[]) => Promise<any>;
};
const db_hr = pool_Hr as typeof pool_Hr & {
  query: (text: string, values?: unknown[]) => Promise<any>;
};

const generatePassword = async (length = 25) => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const allCharacters = uppercase + lowercase + numbers + symbols;

  // Guarantee at least one of each type
  const password = [
    uppercase[crypto.randomInt(uppercase.length)],
    lowercase[crypto.randomInt(lowercase.length)],
    numbers[crypto.randomInt(numbers.length)],
    symbols[crypto.randomInt(symbols.length)],
  ];

  // Fill remaining characters
  while (password.length < length) {
    password.push(allCharacters[crypto.randomInt(allCharacters.length)]);
  }

  // Secure Fisher-Yates shuffle
  for (let i = password.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
};

// console.log(generatePassword());

// -------------------------
// cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// --------------------------
// delete image from the cloudinary
const deleteImage = async (public_id: String) => {
  // console.log("Deleting image with public_id:", public_id);
  try {
    const result = await cloudinary.uploader.destroy(`${public_id}`);
    // console.log(result);
  } catch (err) {
    console.log(err);
  }
};

// -------------------------
// create user
export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      role = "INTERN",
      loginCode = "none",
    } = req.body;

    const hashedPassword = await passwordHash(password);

    const userRegister = await db.query(
      "insert into users (name,email,password_hash) values ($1,$2,$3) returning *",
      [name, email, String(hashedPassword)],
    );

    const userDetails = userRegister?.rows[0];

    if (userRegister?.rows?.length == 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        user: userDetails || null,
      });
    }

    // intern role register -----------------------------
    if (role == "INTERN") {
      const setUserRoles = await db.query(
        `INSERT INTO user_roles (user_id, role_id)
        SELECT $1, id
        FROM roles
        WHERE name = 'INTERN'
        `,
        [userDetails.id],
      );

      if (setUserRoles?.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "User not able to assign roles ",
          user: userDetails || null,
        });
      }
    }

    // emplyee role register ------------------------------
    if (role == "EMPLOYEE") {
      const setUserRoles = await db.query(
        `INSERT INTO user_roles (user_id, role_id)
        SELECT $1, id
        FROM roles
        WHERE name = 'EMPLOYEE'
        `,
        [userDetails.id],
      );

      if (setUserRoles?.rows?.length == 0) {
        return res.status(404).json({
          success: false,
          message: "User not able to assign roles ",
          user: userDetails || null,
        });
      }
    }

    // Manager role register ------------------------------
    if (role == "MANAGER") {
      const setUserRoles = await db.query(
        `INSERT INTO user_roles (user_id, role_id)
        SELECT $1, id
        FROM roles
        WHERE name = 'MANAGER'
        `,
        [userDetails.id],
      );

      if (setUserRoles?.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "User not able to assign roles ",
          user: userDetails || null,
        });
      }
    }

    // HR role register ------------------------------
    if (role == "HR") {
      const setUserRoles = await db.query(
        `INSERT INTO user_roles (user_id, role_id)
        SELECT $1, id
        FROM roles
        WHERE name = 'HR'
        `,
        [userDetails.id],
      );

      if (setUserRoles?.rows?.length == 0) {
        return res.status(404).json({
          success: false,
          message: "User not able to assign roles ",
          user: userDetails || null,
        });
      }
    }

    // ADMIN role register ------------------------------
    if (role == "ADMIN" && loginCode == "confirm") {
      const setUserRoles = await db.query(
        `INSERT INTO user_roles (user_id, role_id)
        SELECT $1, id
        FROM roles
        WHERE name = 'ADMIN'
        `,
        [userDetails.id],
      );

      if (setUserRoles?.rowCount == 0) {
        return res.status(404).json({
          success: false,
          message: "User not able to assign roles ",
          user: userDetails || null,
        });
      }
    }

    const token = await jwtSign(
      { email: email, user_id: userDetails?.id, role: role },
      `${process.env.secretKey}`,
      "30d",
    );


    res.status(200).json({
      message: "user registered sent",
      userDetails: userDetails,
      token: token,
    });
  } catch (error: any) {
    internalError(error, req, res);
  }
};

// -------------------------
// login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // console.log("email", email);
    // console.log("password", password);

    // const userDetailsFetched = await pool.query(
    //   `
    //   SELECT
    //     u.*,
    //     r.name AS role_name
    //     FROM users u
    //     LEFT JOIN user_roles ur
    //       ON ur.user_id = u.id
    //     LEFT JOIN roles r
    //       ON r.id = ur.role_id
    //     WHERE u.email = $1
    //   `,
    //   [email],
    // );

    const userDetailsFetched = await db.query(
      `
      SELECT
        u.*,
        COALESCE(
          ARRAY_AGG(r.name) FILTER (WHERE r.name IS NOT NULL),
          '{}'
        ) AS roles
      FROM users u
      LEFT JOIN user_roles ur
        ON ur.user_id = u.id
      LEFT JOIN roles r
        ON r.id = ur.role_id
      WHERE u.email = $1
      GROUP BY u.id
      `,
      [email],
    );

    // console.log("userDetailsFetched", userDetailsFetched?.rows);

    if (userDetailsFetched?.rows?.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // console.log('userDetailsFetched', userDetailsFetched?.rows[0])

    const userDetails = userDetailsFetched?.rows[0];

    const isPasswordMatched = await comparePassword(
      password,
      userDetails?.password_hash,
    );

    // console.log("isPasswordMatched", isPasswordMatched);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid credetials !!",
      });
    }

    // console.log("userDetails?.role", userDetails?.roles);

    const token = await jwtSign(
      { email: email, user_id: userDetails?.id, role: userDetails?.roles },
      `${process.env.secretKey}`,
      "30d",
    );

    return res.status(200).json({
      success: false,
      message: "User Details Fetched !!",
      user: userDetails || null,
      token: token,
    });
  } catch (error: any) {
    internalError(error, req, res);
  }
};

// -------------------------
//  get User Detail
export const getUserDetail = async (req: Request, res: Response) => {
  const user_id = req?.id;
  const email = req?.email;
  const role = req?.role;
  try {
    // console.log("user role :- \n", role);
    const userDetailFetched = await db.query(
      `
 SELECT
    u.id,
    u.email,
    u.name,
    u.status,
    u.email_verified,
    u.created_at,
    u.updated_at,
    u.last_login_at,
    COALESCE(
        ARRAY_AGG(r.name) FILTER (WHERE r.name IS NOT NULL),
        '{}'
    ) AS roles
FROM users u
LEFT JOIN user_roles ur
    ON ur.user_id = u.id
LEFT JOIN roles r
    ON r.id = ur.role_id
WHERE u.id = $1
  AND u.email = $2
GROUP BY
    u.id,
    u.email,
    u.name,
    u.status,
    u.email_verified,
    u.created_at,
    u.updated_at,
    u.last_login_at;
  `,
      [user_id, email],
    );

    if (userDetailFetched?.rows?.length === 0) {
      return res
        .status(400)
        .json({ message: "user not found !", success: false });
    }

    const userDetail = userDetailFetched?.rows[0];

    // console.log("userdetail", user_id);
    // console.log("userdetail email", email);

    return res
      .status(200)
      .json({ message: "user detail featched !", userDetail: userDetail });
  } catch (error: any) {
    internalError(error, req, res);
  }
};

// -------------------------
// edit user detail
export const editUserDetail = async (req: Request, res: Response) => {
  const { userId } = req?.params;
  const user_id = req?.id;
  const email = req?.email;

  const { name, profilePicture, profileId, oldProfileId } = req.body;

  try {
    // console.log("userId != user_id", userId, user_id);
    if (userId != user_id) {
      return res
        .status(400)
        .json({ message: "your are not the author", success: false });
    }
    const query: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      query.push(`name = $${values.length + 1}`);
      values.push(name);
    }

    if (profilePicture !== undefined) {
      query.push(`profile_picture = $${values.length + 1}`);
      values.push(profilePicture);
    }

    if (profileId !== undefined) {
      query.push(`profile_id = $${values.length + 1}`);
      values.push(profileId);
    }

    if (query.length === 0) {
      return res.status(400).json({
        error: "No fields to update",
        success: false,
      });
    }

    values.push(user_id);

    const sql = `
      UPDATE users
      SET ${query.join(", ")}
      WHERE id = $${values.length}
    `;

    // console.log("SQL:", sql);
    // console.log("VALUES:", values);

    const result = await db.query(sql, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    if (String(oldProfileId) === "user_ea010y") {
      // console.log("Default image not deleted");
    } else if (oldProfileId && oldProfileId !== profileId) {
      await deleteImage(oldProfileId);
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error: any) {
    return internalError(error, req, res);
  }
};

// --------------------------
// get qualified candidates
export const getQualifiedCandidates = async (req: Request, res: Response) => {
  try {
    // console.log("req.body", req.body);
    // const featchQualifiedCandidate = await db_hr.query(
    //   `
    //   SELECT * FROM qualified_candidates;
    //   `,
    //   [],
    // );
    const featchQualifiedCandidate = await db_hr.query(
      `
    SELECT
    qc.id,
    qc.candidate_id,
    qc.application_id,
    qc.interview_id,
    qc.status,

    -- Candidate details
    jsonb_build_object(
        'id', c.id,
        'first_name', c.first_name,
        'last_name', c.last_name,
        'email', c.email,
        'phone', c.phone,
        'resume_url', c.resume_url
    ) AS candidate,

    -- Application details
    jsonb_build_object(
        'id', a.id,
        'application_code', a.application_code,
        'candidate_id', a.candidate_id,
        'role', a.role,
        'department', a.department,
        'application_type', a.application_type,
        'duration_months', a.duration_months,
        'work_mode', a.work_mode,
        'status', a.status
    ) AS application

    FROM qualified_candidates qc

    INNER JOIN applications a
        ON qc.application_id = a.id

    INNER JOIN candidates c
        ON qc.candidate_id = c.id;
      `,
      [],
    );

    // console.log("featchQualifiedCandidate", featchQualifiedCandidate?.rows);
    if (featchQualifiedCandidate?.rows?.length == 0) {
      return res
        .status(400)
        .json({ message: "error fetching the details", success: false });
    }

    const qualifiedCandidate = featchQualifiedCandidate?.rows;

    // console.log("quali", qualifiedCandidate);

    return res.status(200).json({
      messgae: "candidate detial fetched",
      success: true,
      qualifiedCandidate,
    });
  } catch (error: any) {
    return internalError(error, req, res);
  }
};

// register Intern
export const registerIntern = async (req: Request, res: Response) => {
  try {
    const { interview_id } = req.params;
    const { name, email, role = "INTERN" } = req.body;

    const password = await generatePassword(25);
    console.log("password before :-", password);

    const hashedPassword = await passwordHash(password);
    console.log("name, email,", name, email);

    const userRegister = await db.query(
      "insert into users (name,email,password_hash) values ($1,$2,$3) returning *",
      [name, email, String(hashedPassword)],
    );

    const userDetails = userRegister?.rows[0];

    console.log('userDetails', userDetails)

    if (userRegister?.rows?.length == 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        user: userDetails || null,
      });
    }

    // intern role register -----------------------------
    if (role == "INTERN") {
      const setUserRoles = await db.query(
        `INSERT INTO user_roles (user_id, role_id)
        SELECT $1, id
        FROM roles
        WHERE name = 'INTERN'
        `,
        [userDetails.id],
      );

      console.log('interview_id', interview_id)

      const updateStatus = await db_hr.query(
        `update qualified_candidates
        set status = 'COMPLETED'
        WHERE id = $1
        `,
        [interview_id],
      );

      if (updateStatus?.rowCount == 0) {
        return res.status(400).json({
          success: false,
          message: "User not able o qualify",
          user: userDetails || null,
        });
      }

      if (setUserRoles?.rowCount == 0) {
        return res.status(400).json({
          success: false,
          message: "User not able to assign roles ",
          user: userDetails || null,
        });
      }

      const userDetail = userRegister.rows[0];
      // console.log("userDetail", userDetail);

      await sendInternshipPortalCredentialsEmail(email, userDetail, password);
    }

    res.status(200).json({
      message: "user registered sent",
      userDetails: userDetails,
    });
  } catch (error: any) {
    internalError(error, req, res);
  }
};

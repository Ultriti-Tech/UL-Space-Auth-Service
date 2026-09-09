import { Request, Response } from "express";
import {pool} from "../../../config/sqldb";
import {
  passwordHash,
  jwtSign,
  setCookies,
  comparePassword,
} from "../Service/Auth.service";
import { internalError } from "../Service/Error.service";
import { v2 as cloudinary } from "cloudinary";
import { CLIENT_RENEG_WINDOW } from "node:tls";

const db = pool as typeof pool & {
  query: (text: string, values?: unknown[]) => Promise<any>;
};


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
      password_hash,
      role = "INTERN",
      loginCode = null,
    } = req.body;

    const hashedPassword = await passwordHash(String(password_hash));

    const userRegister = await db.query(
      "insert into users (name,email,password_hash) values ($1,$2,$3) returning *",
      [name, email, hashedPassword],
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

      if (setUserRoles?.rows?.length == 0) {
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
    if (role == "ADMIN" && loginCode == "conform") {
      const setUserRoles = await db.query(
        `INSERT INTO user_roles (user_id, role_id)
        SELECT $1, id
        FROM roles
        WHERE name = 'ADMIN'
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

    const token = await jwtSign(
      { email: email, user_id: userDetails?.id, role: role },
      `${process.env.secretKey}`,
      "30d",
    );

    // console.log("token :- ", token);
    setCookies("ulSpaceToken", token, req, res);

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

    console.log("email", email);
    console.log("password", password);

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

    if (userDetailsFetched?.rows?.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // console.log('userDetailsFetched', userDetailsFetched?.rows[0])

    const userDetails = userDetailsFetched?.rows[0];

    const isPasswordMatched = await comparePassword(
      String(password),
      String(userDetails?.password_hash),
    );

    // console.log('isPasswordMatched', isPasswordMatched)

    if (!isPasswordMatched) {
      return res.status(404).json({
        success: false,
        message: "Invalid credetials !!",
      });
    }

    console.log('userDetails?.role', userDetails?.roles)

    const token = await jwtSign(
      { email: email, user_id: userDetails?.id, role: userDetails?.roles },
      `${process.env.secretKey}`,
      "30d",
    );

    // console.log("token :- ", token);
    setCookies("ulSpaceToken", token, req, res);

    return res.status(200).json({
      success: false,
      message: "User Details Fetched !!",
      user: userDetails || null,
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
    console.log('user role :- \n', role)
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

    console.log("userdetail", user_id);
    console.log("userdetail email", email);

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

    console.log("SQL:", sql);
    console.log("VALUES:", values);

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



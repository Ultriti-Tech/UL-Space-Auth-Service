import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

// hash the password
export const passwordHash = async (password: any): Promise<string> => {
  // const hashPassword = async (password) =>{
  //   return await bcrypt.hash(password, 10);
  console.log('password', password)
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

// compare hashed password
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// generate jwt token
export const jwtSign = (
  payload: object,
  secret: string,
  expiresIn: string,
): Promise<string> =>
  new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn }, (err, token) => {
      if (err) reject(err);
      else resolve(token!);
    });
  });

//   set cookies to header
export const setCookies = (
  cookieName: string,
  token: string,
  req: Request,
  res: Response,
) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
        path: "/",
    expires: new Date(Date.now() + 3600000 * 24 * 30),
  });
};

import type { Request, Response } from "express";

export const internalError = async (
  error: object,
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("error", error);


//   const dbError = error as Error & { constraint?: string };
//     console.error("❌ Error creating user:", dbError.message);
//     if (dbError.constraint == "users_email_key") {


  if (error instanceof Error) {
    console.error("❌ Error creating user:", error.message);
    if (error?.constraint == "users_email_key") {
      res.status(400).json({
        success: false,
        message: "email id Alredy exists !!",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

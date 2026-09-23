import puppeteer from "puppeteer";
import nodemailer from "nodemailer";
require("dotenv").config();

import path from "path";

// const logoPath = path.resolve("backend/assets/ultriti-logo.jpg");
// const backgroundPath = path.resolve("backend/assets/Internship-Offer-Letter.jpg");
// const signaturePath = path.resolve("backend/assets/Screenshot_20241012_164238_Image to PDF Converter.jpg");

// =====================================================
// CREATE SMTP TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.hostinger.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  requireTLS: Number(process.env.EMAIL_PORT) !== 465,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 30000,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =====================================================
// GENERIC SEND EMAIL FUNCTION
// =====================================================

const sendEmail = async (to: String, subject: any, html: any, text = "") => {
//   console.log("--------------------\n\n", to, subject, html, text);
  try {
    const info = await transporter.sendMail({
      from: `"UL-Space" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("❌ Email error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

// send portal axcess
export const sendInternshipPortalCredentialsEmail = async (
  email: String,
  candidate_detail: any,
  providedPassword: any,
) => {
  const candidate_name =
    `${candidate_detail?.first_name || ""} ${candidate_detail?.last_name || ""}`.trim() ||
    "Candidate";

  const username = candidate_detail?.email || email;
  const password = providedPassword || "";

  const portal_login_url = "https://ulspace.ultriti.com/user/login";
  const account_settings_url = "https://ul-space.com/user/account-settings";
  const subject = `🎉 Welcome to Ul-Space – Your Internship Portal Account`;

  console.log('sending portal axcess mail to :- ', email)

  // =====================================================
  // PLAIN TEXT EMAIL
  // =====================================================

  const text = `
Hi ${candidate_name},

Welcome to Ul-Space! 🎉

Your internship portal account has been successfully created.
You can now access the Ul-Space portal to continue your internship journey,
access learning resources, and stay updated with internship-related information.

Your login details are:

Email / Username: ${username}
Password: ${password}

👉 Important:

For security reasons, we strongly recommend changing your password
after your first login.

You can update your password from the Account Settings page:

${account_settings_url}

🔐 Login to Ul-Space:

${portal_login_url}

Additional Information:

• You can log in using your registered email address or username.
• Please keep your login credentials secure and do not share your password with anyone.
• Your portal will be used for internship-related communication, learning resources,
  tasks, and other relevant activities.

We're excited to have you onboard and wish you a great learning and
internship experience with Ul-Space! 🚀

If you face any issues accessing your account, please contact the
Ul-Space HR / Support Team.

Warm regards,
Ul-Space HR Team
Ultriti
support@ultriti.com
`;

  // =====================================================
  // HTML EMAIL
  // =====================================================

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Ul-Space</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #ffffff;
  font-family: Arial, Helvetica, sans-serif;
  color: #333333;
">

  <div style="
    max-width: 650px;
    margin: 30px auto;
    padding: 35px;
    background-color: #ffffff;
    color: #333333;
    border: 1px solid #eeeeee;
    border-radius: 8px;
  ">

    <!-- HEADER -->

    <div style="
      text-align: center;
      margin-bottom: 30px;
    ">

      <h1 style="
        margin: 0 0 10px;
        color: #1c3f8f;
        font-size: 26px;
      ">
        Welcome to Ul-Space
      </h1>

      <p style="
        margin: 0;
        font-size: 16px;
        color: #666666;
      ">
        Your internship portal account is ready!
      </p>

    </div>


    <!-- INTRODUCTION -->

    <p>
      Hi <strong>${candidate_name}</strong>,
    </p>

    <p>
      Welcome to <strong>Ul-Space</strong>! 🎉
    </p>

    <p>
      Your internship portal account has been successfully created.
      You can now access the Ul-Space portal to continue your internship
      journey, access learning resources, and stay updated with
      internship-related information.
    </p>


    <!-- LOGIN DETAILS -->

    <div style="
      margin: 25px 0;
      padding: 20px;
      background-color: #f5f7fa;
      border-radius: 6px;
      border-left: 4px solid #1c3f8f;
    ">

      <h3 style="
        margin: 0 0 22px 0;
        color: #1c3f8f;
        font-size: 18px;
      ">
        🔐 Your Login Details
      </h3>


      <!-- USERNAME -->

      <div style="
        margin: 0 0 18px 0;
      ">

        <div style="
          font-weight: bold;
          margin-bottom: 6px;
          color: #222222;
        ">
          Email / Username:
        </div>

        <div style="
          font-size: 15px;
          line-height: 22px;
          color: #0645ad;
          word-break: break-word;
          overflow-wrap: anywhere;
        ">
          ${username}
        </div>

      </div>


      <!-- PASSWORD -->

      <div style="
        margin: 0;
      ">

        <div style="
          font-weight: bold;
          margin-bottom: 6px;
          color: #222222;
        ">
          Password:
        </div>

        <div style="
          display: block;
          width: 100%;
          box-sizing: border-box;
          padding: 10px 12px;
          background-color: #ffffff;
          border: 1px solid #d9dee7;
          border-radius: 5px;
          color: #222222;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 15px;
          line-height: 22px;
          word-break: break-all;
          overflow-wrap: anywhere;
          white-space: normal;
        ">
          ${password}
        </div>

      </div>

    </div>


    <!-- LOGIN BUTTON -->

    <div style="
      text-align: center;
      margin: 30px 0;
    ">

      <a
        href="${portal_login_url}"
        style="
          display: inline-block;
          padding: 13px 30px;
          background-color: #1c3f8f;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          font-size: 16px;
        "
      >
        🚀 Login to Ul-Space
      </a>

    </div>


    <!-- IMPORTANT -->

    <div style="
      margin: 25px 0;
      padding: 16px;
      background-color: #fff8e6;
      border-radius: 6px;
      font-size: 14px;
      color: #555555;
    ">

      <strong>👉 Important:</strong>

      <p style="
        margin: 12px 0 0 0;
      ">
        For security reasons, we strongly recommend changing your password
        after your first login.
      </p>

      <p style="
        margin: 12px 0 0 0;
      ">
        You can update your password from the
        <a
          href="${account_settings_url}"
          style="
            color: #1c3f8f;
            font-weight: bold;
          "
        >
          Account Settings
        </a>
        page.
      </p>

    </div>


    <!-- ADDITIONAL INFORMATION -->

    <h3 style="
      margin-top: 30px;
      color: #1c3f8f;
    ">
      Additional Information
    </h3>

    <ul style="
      padding-left: 20px;
      line-height: 1.7;
    ">

      <li>
        You can log in using either your registered email address
        or username.
      </li>

      <li>
        Please keep your login credentials secure and do not share
        your password with anyone.
      </li>

      <li>
        Your Ul-Space account may be used for internship-related
        communication, learning resources, tasks, and other relevant
        activities.
      </li>

    </ul>


    <!-- CLOSING -->

    <p style="margin-top: 25px;">
      We're excited to have you onboard and wish you a great learning
      and internship experience with <strong>Ul-Space</strong>! 🚀
    </p>

    <p>
      If you face any issues accessing your account, please feel free
      to contact the Ul-Space HR / Support Team.
    </p>


    <!-- FOOTER -->

    <p style="margin-top: 30px;">
      Warm regards,<br>
      <strong>Ul-Space HR Team</strong><br>
      Ultriti<br>
      support@ultriti.com
    </p>

  </div>

</body>
</html>
`;

  // =====================================================
  // SEND EMAIL
  // =====================================================

  try {
    const info = await sendEmail(email, subject, html, text);

    if (!info.success) {
      return {
        Success: false,
        error: info.error,
      };
    }

    console.log(
      `✅ Ul-Space internship portal credentials email sent to ${email}`,
    );

    return {
      Success: true,
      info,
    };
  } catch (error: any) {
    console.error(
      `❌ Failed to send Ul-Space portal email to ${email}:`,
      error,
    );

    return {
      Success: false,
      error: error.message,
    };
  }
};

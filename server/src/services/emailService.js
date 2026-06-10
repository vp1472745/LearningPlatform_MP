import nodemailer from "nodemailer";

const EMAIL_USER =
  process.env.EMAIL_USER||"voteease1611@gmail.com";

const EMAIL_PASS =
  process.env.EMAIL_PASS||"dxgxdgkfvewufmfi";

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

transporter.verify(
  (error, success) => {
    if (error) {
      console.log(
        "SMTP Error:",
        error
      );
    } else {
      console.log(
        "SMTP Server Ready"
      );
    }
  }
);

export const sendStudentCredentials =
  async ({
    name,
    email,
    username,
    password,
  }) => {
    try {
      const info =
        await transporter.sendMail({
          from: `"Smart Learning Platform" <${EMAIL_USER}>`,

          to: email,

          subject:
            "Smart Learning Platform Login Credentials",

          html: `
          <div style="font-family:Arial,sans-serif">
          
          <h2>Welcome To Smart Learning Platform</h2>

          <p>Hello ${name},</p>

          <p>Your account has been created successfully.</p>

          <h3>Login Credentials</h3>

          <p>
            <strong>Username:</strong>
            ${username}
          </p>

          <p>
            <strong>Password:</strong>
            ${password}
          </p>

          <p>
            Please login and change your password.
          </p>

          <br>

          <p>Regards,</p>
          <p>Admin Team</p>

          </div>
          `,
        });

      console.log(
        "Mail Sent:",
        info.messageId
      );

      return true;
    } catch (error) {
      console.log(
        "Mail Error:",
        error
      );

      return false;
    }
  };
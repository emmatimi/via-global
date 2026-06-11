import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const MINISTRY_NAME = "VIA Global";

const getPublicSiteUrl = () => {
  const configuredUrl =
    process.env.PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  return configuredUrl.replace(/\/+$/, "");
};

const getPublicLogoUrl = () => {
  const siteUrl = getPublicSiteUrl();
  return siteUrl ? `${siteUrl}/assets/via-ministry-logo-web.png` : "";
};

// Create transporter from environment variables
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const getFromAddress = () => `"${MINISTRY_NAME}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`;

const getEmailFooter = (note?: string) => `
  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
    ${note ? `<p style="margin: 0 0 12px;">${note}</p>` : ""}
    <p style="margin: 0;">With care,<br/><strong style="color: #1e293b;">${MINISTRY_NAME}</strong></p>
  </div>
`;

const getBrandedEmailShell = (title: string, body: string, footerNote?: string) => {
  const logoUrl = getPublicLogoUrl();

  return `
  <div style="font-family: Arial, Helvetica, sans-serif; padding: 24px; color: #1e293b; background: #f8fafc;">
    <div style="max-width: 640px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0;">
      ${logoUrl ? `
      <div style="margin-bottom: 24px;">
        <img src="${logoUrl}" alt="${MINISTRY_NAME} logo" style="display: block; width: 180px; max-width: 100%; height: auto;" />
      </div>
      ` : ""}
      <h2 style="color: #b35a12; margin: 0 0 16px; font-family: Georgia, serif; font-style: italic;">${title}</h2>
      <div style="font-size: 14px; line-height: 1.7; color: #334155;">
        ${body}
      </div>
      ${getEmailFooter(footerNote)}
    </div>
  </div>
`;
};

const deliverInBackground = async (jobs: Promise<unknown>[], label: string) => {
  const results = await Promise.allSettled(jobs);
  const failures = results.filter((result) => result.status === "rejected");
  if (failures.length > 0) {
    console.error(`${label} failed`, failures);
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // API Route for sending contact emails
  app.post("/api/contact", async (req, res) => {
    try {
      const { firstName, lastName, email, subject, message } = req.body;
      
      const transporter = getTransporter();
      
      await transporter.sendMail({
        from: getFromAddress(),
        to: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        subject: `New Contact Request: ${subject}`,
        html: getBrandedEmailShell(
          "New Contact Request",
          `
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br/>")}</p>
          `,
          "This message was submitted from the public contact form."
        ),
      });

      res.json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
      console.error("Error sending contact email:", error);
      res.status(500).json({ success: false, error: "Failed to send email" });
    }
  });

  // API Route for sending registration emails
  app.post("/api/register", async (req, res) => {
    try {
      const {
        fullName,
        email,
        phone,
        location,
        programId,
        programTitle,
        programVenue,
        programDate,
        programTime,
      } = req.body;
      
      const transporter = getTransporter();

      res.once("finish", () => {
        void deliverInBackground(
          [
            transporter.sendMail({
              from: getFromAddress(),
              to: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
              replyTo: email,
              subject: `New Registration: ${programTitle}`,
              html: getBrandedEmailShell(
                "New Program Registration",
                `
                  <p><strong>Program:</strong> ${programTitle}</p>
                  <p><strong>Date:</strong> ${programDate || "To be announced"}</p>
                  <p><strong>Time:</strong> ${programTime || "To be announced"}</p>
                  <p><strong>Venue:</strong> ${programVenue || "To be announced"}</p>
                  <p><strong>Registrant Name:</strong> ${fullName}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
                  <p><strong>Location:</strong> ${location || "Not provided"}</p>
                `,
                "A new attendee has registered through the ministry website."
              ),
            }),
            transporter.sendMail({
              from: getFromAddress(),
              to: email,
              subject: `Registration Confirmed: ${programTitle}`,
              html: getBrandedEmailShell(
                "Registration Complete",
                `
                  <p>Hello ${fullName},</p>
                  <p>Thank you for registering for <strong>${programTitle}</strong>.</p>
                  <p><strong>Venue:</strong> ${programVenue || "To be announced"}</p>
                  <p><strong>Date:</strong> ${programDate || "To be announced"}</p>
                  <p><strong>Time:</strong> ${programTime || "To be announced"}</p>
                  <p><strong>Your Location:</strong> ${location || "Not provided"}</p>
                  ${phone ? `<p><strong>Your Phone:</strong> ${phone}</p>` : ""}
                `,
                "You are receiving this confirmation because you completed a registration on the ministry website."
              ),
            }),
          ],
          "Registration email delivery"
        );
      });

      res.json({ success: true, message: "Registration successful!" });
    } catch (error) {
      console.error("Error sending registration email:", error);
      res.status(500).json({ success: false, error: "Failed to process registration" });
    }
  });

  // API Route for sending prayer and question requests to administrative leadership
  app.post("/api/prayer", async (req, res) => {
    try {
      const { name, email, request } = req.body;
      
      const transporter = getTransporter();
      
      await transporter.sendMail({
        from: getFromAddress(),
        to: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        replyTo: email || undefined,
        subject: `[Confidential Prayer Request]: Submitted via Got a Question`,
        html: getBrandedEmailShell(
          "Intercession Request Alert",
          `
            <p>A new secure/confidential prayer and guidance request was submitted online:</p>
            <p><strong>Name:</strong> ${name || "Anonymous"}</p>
            <p><strong>Reply/Follow-up Email:</strong> ${email || "Not Provided"}</p>
            <p><strong>Petition / Question details:</strong></p>
            <blockquote style="background: #f1f5f9; border-left: 4px solid #b35a12; padding: 15px; font-style: italic; margin: 20px 0; color: #475569;">
              ${request.replace(/\n/g, "<br/>")}
            </blockquote>
          `,
          "Please treat this information with extreme pastoral confidentiality."
        ),
      });

      res.json({ success: true, message: "Prayer request submitted to intercessors successfully!" });
    } catch (error) {
      console.error("Error processing prayer request:", error);
      res.status(500).json({ success: false, error: "Failed to submit prayer request" });
    }
  });

  // API Route for sending bulk broadcast email to registered users
  app.post("/api/broadcast", async (req, res) => {
    try {
      const { recipients, subject, message } = req.body;
      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ success: false, error: "No recipients provided" });
      }
      
      const transporter = getTransporter();
      
      const emailPromises = recipients.map(email => 
        transporter.sendMail({
          from: getFromAddress(),
          to: email,
          subject: subject,
          html: getBrandedEmailShell(
            `${MINISTRY_NAME} Update`,
            `
              <h3 style="color: #0f172a; margin-top: 0;">${subject}</h3>
              <div style="font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${message}</div>
            `,
            `You received this email because you are registered for a program at ${MINISTRY_NAME}.`
          ),
        })
      );

      await Promise.all(emailPromises);
      res.json({ success: true, message: "Broadcast sent successfully to all recipients!" });
    } catch (error) {
      console.error("Error sending bulk broadcast email:", error);
      res.status(500).json({ success: false, error: "Failed to send broadcast emails" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import dotenv from "dotenv";
import { deliverInBackground, getBrandedEmailShell, getFromAddress, getTransporter } from "./lib/mail";
import { applyShareMeta, getDefaultShareMeta, getProgramShareMeta, MINISTRY_NAME } from "./lib/site";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3001;
  let vite: Awaited<ReturnType<typeof createViteServer>> | null = null;

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
                  <p>Thank you for registering for <strong>${programTitle}</strong>, Come and be blessed.</p>
                  <p><strong>Venue:</strong> ${programVenue || "To be announced"}</p>
                  <p><strong>Date:</strong> ${programDate || "To be announced"}</p>
                  <p><strong>Time:</strong> ${programTime || "To be announced"}</p>
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
      const { name, email, requestType, request } = req.body;
      const isPrayerRequest = requestType === "prayer";
      const submissionType = isPrayerRequest ? "Prayer Request" : "Question";
      
      const transporter = getTransporter();
      
      await transporter.sendMail({
        from: getFromAddress(),
        to: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        replyTo: email || undefined,
        subject: `[Confidential ${submissionType}]: Submitted via Got a Question`,
        html: getBrandedEmailShell(
          `New ${submissionType}`,
          `
            <p>A new confidential ${submissionType.toLowerCase()} was submitted online:</p>
            <p><strong>Submission Type:</strong> ${submissionType}</p>
            <p><strong>Name:</strong> ${name || "Anonymous"}</p>
            <p><strong>Reply/Follow-up Email:</strong> ${email || "Not Provided"}</p>
            <p><strong>${submissionType} Details:</strong></p>
            <blockquote style="background: #f1f5f9; border-left: 4px solid #b35a12; padding: 15px; font-style: italic; margin: 20px 0; color: #475569;">
              ${request.replace(/\n/g, "<br/>")}
            </blockquote>
          `,
          "Please treat this information with extreme pastoral confidentiality."
        ),
      });

      res.json({ success: true, message: `${submissionType} submitted successfully!` });
    } catch (error) {
      console.error("Error processing question or prayer request:", error);
      res.status(500).json({ success: false, error: "Failed to submit question or prayer request" });
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
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
  }

  app.get('*', async (req, res) => {
    try {
      const programMatch = req.path.match(/^\/programs\/([^/#?]+)/);
      const routeMeta = programMatch
        ? await getProgramShareMeta(decodeURIComponent(programMatch[1]))
        : null;
      const shareMeta = routeMeta || getDefaultShareMeta();

      if (vite) {
        const templatePath = path.join(process.cwd(), 'index.html');
        let template = fs.readFileSync(templatePath, 'utf8');
        template = applyShareMeta(template, shareMeta);
        const html = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        return;
      }

      const distPath = path.join(process.cwd(), 'dist');
      const template = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
      const html = applyShareMeta(template, shareMeta);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      console.error("Failed to render page metadata", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

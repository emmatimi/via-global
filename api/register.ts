import { getBrandedEmailShell, getFromAddress, getTransporter } from "../lib/mail";
import { readJsonBody, withJsonResponse, type ApiRequest, type ApiResponse } from "./_shared";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const response = withJsonResponse(res);

  if (req.method !== "POST") {
    response.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  try {
    const {
      fullName,
      email,
      phone,
      location,
      programTitle,
      programVenue,
      programDate,
      programTime,
    } = await readJsonBody(req);

    if (!fullName || !email || !programTitle) {
      response.status(400).json({ success: false, error: "Missing required registration fields" });
      return;
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("Registration email configuration is incomplete on the server");
      response.status(500).json({ success: false, error: "Email service is not configured" });
      return;
    }

    const transporter = getTransporter();

    await Promise.all([
      transporter.sendMail({
        from: getFromAddress(),
        to: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        replyTo: typeof email === "string" ? email : undefined,
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
        to: String(email),
        subject: `Registration Confirmed: ${programTitle}`,
        html: getBrandedEmailShell(
          "Registration Complete",
          `
            <p>Hello ${fullName},</p>
            <p>Thank you for registering for <strong>${programTitle}</strong>.</p>
            <p><strong>Venue:</strong> ${programVenue || "To be announced"}</p>
            <p><strong>Date:</strong> ${programDate || "To be announced"}</p>
            <p><strong>Time:</strong> ${programTime || "To be announced"}</p>
          `,
          "You are receiving this confirmation because you completed a registration on the ministry website."
        ),
      }),
    ]);

    response.json({ success: true, message: "Registration successful!" });
  } catch (error) {
    console.error("Error sending registration email:", error);
    response.status(500).json({ success: false, error: "Failed to process registration" });
  }
}

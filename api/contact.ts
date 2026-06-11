import { getBrandedEmailShell, getFromAddress, getTransporter } from "../lib/mail";
import { readJsonBody, withJsonResponse, type ApiRequest, type ApiResponse } from "./_shared";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const response = withJsonResponse(res);

  if (req.method !== "POST") {
    response.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  try {
    const { firstName, lastName, email, subject, message } = await readJsonBody(req);
    const transporter = getTransporter();

    await transporter.sendMail({
      from: getFromAddress(),
      to: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      replyTo: typeof email === "string" ? email : undefined,
      subject: `New Contact Request: ${subject}`,
      html: getBrandedEmailShell(
        "New Contact Request",
        `
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${String(message || "").replace(/\n/g, "<br/>")}</p>
        `,
        "This message was submitted from the public contact form."
      ),
    });

    response.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending contact email:", error);
    response.status(500).json({ success: false, error: "Failed to send email" });
  }
}


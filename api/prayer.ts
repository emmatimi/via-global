import { getBrandedEmailShell, getFromAddress, getTransporter } from "../lib/mail";
import { readJsonBody, withJsonResponse, type ApiRequest, type ApiResponse } from "./_shared";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const response = withJsonResponse(res);

  if (req.method !== "POST") {
    response.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  try {
    const { name, email, request } = await readJsonBody(req);
    const transporter = getTransporter();

    await transporter.sendMail({
      from: getFromAddress(),
      to: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      replyTo: typeof email === "string" ? email : undefined,
      subject: "[Confidential Prayer Request]: Submitted via Got a Question",
      html: getBrandedEmailShell(
        "Intercession Request Alert",
        `
          <p>A new secure/confidential prayer and guidance request was submitted online:</p>
          <p><strong>Name:</strong> ${name || "Anonymous"}</p>
          <p><strong>Reply/Follow-up Email:</strong> ${email || "Not Provided"}</p>
          <p><strong>Petition / Question details:</strong></p>
          <blockquote style="background: #f1f5f9; border-left: 4px solid #b35a12; padding: 15px; font-style: italic; margin: 20px 0; color: #475569;">
            ${String(request || "").replace(/\n/g, "<br/>")}
          </blockquote>
        `,
        "Please treat this information with extreme pastoral confidentiality."
      ),
    });

    response.json({ success: true, message: "Prayer request submitted to intercessors successfully!" });
  } catch (error) {
    console.error("Error processing prayer request:", error);
    response.status(500).json({ success: false, error: "Failed to submit prayer request" });
  }
}


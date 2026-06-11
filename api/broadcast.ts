import { getBrandedEmailShell, getFromAddress, getTransporter } from "../lib/mail";
import { MINISTRY_NAME } from "../lib/site";
import { readJsonBody, withJsonResponse, type ApiRequest, type ApiResponse } from "./_shared";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const response = withJsonResponse(res);

  if (req.method !== "POST") {
    response.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  try {
    const { recipients, subject, message } = await readJsonBody(req);
    if (!Array.isArray(recipients) || recipients.length === 0) {
      response.status(400).json({ success: false, error: "No recipients provided" });
      return;
    }

    const transporter = getTransporter();

    await Promise.all(
      recipients.map((email) =>
        transporter.sendMail({
          from: getFromAddress(),
          to: String(email),
          subject: String(subject || ""),
          html: getBrandedEmailShell(
            `${MINISTRY_NAME} Update`,
            `
              <h3 style="color: #0f172a; margin-top: 0;">${subject}</h3>
              <div style="font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${message}</div>
            `,
            `You received this email because you are registered for a program at ${MINISTRY_NAME}.`
          ),
        })
      )
    );

    response.json({ success: true, message: "Broadcast sent successfully to all recipients!" });
  } catch (error) {
    console.error("Error sending bulk broadcast email:", error);
    response.status(500).json({ success: false, error: "Failed to send broadcast emails" });
  }
}


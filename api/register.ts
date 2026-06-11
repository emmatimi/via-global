import nodemailer from "nodemailer";
import type { IncomingMessage, ServerResponse } from "http";

type ApiRequest = IncomingMessage & {
  body?: any;
};

type ApiResponse = ServerResponse & {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

const MINISTRY_NAME = "VIA Global";

const withJsonResponse = (res: ApiResponse) => {
  const response = res;

  response.status = (code: number) => {
    response.statusCode = code;
    return response;
  };

  response.json = (body: unknown) => {
    if (!response.getHeader("Content-Type")) {
      response.setHeader("Content-Type", "application/json");
    }

    response.end(JSON.stringify(body));
  };

  return response;
};

const readJsonBody = async (req: ApiRequest) => {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody) as Record<string, unknown>;
};

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
  return siteUrl
    ? `${siteUrl}/assets/via-ministry-logo-web.png`
    : "https://ik.imagekit.io/4lndq5ke52/vialogo.png?updatedAt=1781025642014";
};

const getTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const getFromAddress = () =>
  `"${MINISTRY_NAME}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`;

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

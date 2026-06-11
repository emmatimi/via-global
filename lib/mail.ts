import nodemailer from "nodemailer";
import { getPublicLogoUrl, MINISTRY_NAME } from "./site.js";

export const getTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

export const getFromAddress = () =>
  `"${MINISTRY_NAME}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`;

const getEmailFooter = (note?: string) => `
  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
    ${note ? `<p style="margin: 0 0 12px;">${note}</p>` : ""}
    <p style="margin: 0;">With care,<br/><strong style="color: #1e293b;">${MINISTRY_NAME}</strong></p>
  </div>
`;

export const getBrandedEmailShell = (title: string, body: string, footerNote?: string) => {
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

export const deliverInBackground = async (jobs: Promise<unknown>[], label: string) => {
  const results = await Promise.allSettled(jobs);
  const failures = results.filter((result) => result.status === "rejected");
  if (failures.length > 0) {
    console.error(`${label} failed`, failures);
  }
};

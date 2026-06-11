import { getProgramImageSource, getPublicLogoUrl } from "../lib/site.js";
import { type ApiRequest, type ApiResponse } from "./_shared.js";

const DATA_URL_PATTERN = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/;

const sendRedirect = (res: ApiResponse, location: string) => {
  res.statusCode = 302;
  res.setHeader("Location", location);
  res.end();
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Method not allowed" }));
    return;
  }

  try {
    const idParam = req.query?.id;
    const programId = Array.isArray(idParam) ? idParam[0] : idParam;

    if (!programId) {
      sendRedirect(res, getPublicLogoUrl());
      return;
    }

    const imageSource = await getProgramImageSource(programId);
    if (!imageSource) {
      sendRedirect(res, getPublicLogoUrl());
      return;
    }

    const dataUrlMatch = imageSource.match(DATA_URL_PATTERN);
    if (dataUrlMatch) {
      const [, mimeType, base64Payload] = dataUrlMatch;
      const imageBuffer = Buffer.from(base64Payload, "base64");
      res.statusCode = 200;
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.end(imageBuffer);
      return;
    }

    if (/^https?:\/\//i.test(imageSource)) {
      sendRedirect(res, imageSource);
      return;
    }

    sendRedirect(res, getPublicLogoUrl());
  } catch (error) {
    console.error("Failed to serve program preview image", error);
    sendRedirect(res, getPublicLogoUrl());
  }
}

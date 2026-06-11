import fs from "fs";
import path from "path";
import { applyShareMeta, getDefaultShareMeta, getProgramShareMeta } from "../lib/site.js";
import { withJsonResponse, type ApiRequest, type ApiResponse } from "./_shared.js";

const getBuiltHtmlTemplate = () => {
  const templatePath = path.join(process.cwd(), "dist", "index.html");
  return fs.readFileSync(templatePath, "utf8");
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const response = withJsonResponse(res);

  if (req.method !== "GET") {
    response.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  try {
    const idParam = req.query?.id;
    const programId = Array.isArray(idParam) ? idParam[0] : idParam;
    const routeMeta = programId ? await getProgramShareMeta(programId) : null;
    const shareMeta = routeMeta || getDefaultShareMeta();
    const html = applyShareMeta(getBuiltHtmlTemplate(), shareMeta);

    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end(html);
  } catch (error) {
    console.error("Failed to render program share page", error);
    response.status(500).json({ success: false, error: "Failed to render page" });
  }
}

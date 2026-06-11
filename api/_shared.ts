import type { IncomingMessage, ServerResponse } from "http";

export type ApiRequest = IncomingMessage & {
  body?: any;
  query?: Record<string, string | string[] | undefined>;
};

export type ApiResponse = ServerResponse & {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => ApiResponse;
  send?: (body: string) => void;
};

export const withJsonResponse = (res: ApiResponse) => {
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

export const readJsonBody = async (req: ApiRequest) => {
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


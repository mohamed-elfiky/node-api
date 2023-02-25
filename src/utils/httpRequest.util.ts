import { IncomingHttpHeaders } from "http";
import * as https from "https";
import { URL } from "url";

const constructUrl = (url: string): URL => {
  let urlObject: URL;

  try {
    urlObject = new URL(url);
  } catch (error) {
    throw new Error(`Invalid url ${url}`);
  }

  return urlObject;
};

export const enum Method {
  GET = "GET",
  POST = "POST",
  HEAD = "HEAD",
  PUT = "PUT",
  PATCH = "PATCH",
}

export interface Response<T> {
  statusCode: number | undefined;
  body: T;
  headers: IncomingHttpHeaders;
}

export async function httpRequest<T>(
  method: Method,
  url: string,
  body = null
): Promise<Response<T>> {
  if (body && method !== Method.POST) {
    throw new Error(
      `Invalid use of the body parameter while using the ${method.toUpperCase()} method.`
    );
  }

  const urlObject = constructUrl(url);

  let options = {
    method: method,
    hostname: urlObject.hostname,
    port: urlObject.port,
    path: urlObject.pathname,
    headers: {},
    maxRedirects: 20,
    accept: "application/json",
    agent: new https.Agent({ keepAlive: true, maxSockets: 25 }),
  };

  if (body) {
    options.headers = { "Content-Length": Buffer.byteLength(body) };
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks: any[] = [];

      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const { statusCode, headers } = res;
        const validResponse = statusCode! >= 200 && statusCode! <= 299;
        const body = validResponse ? (JSON.parse(chunks.join("")) as T) : null;
        if (validResponse) resolve({ statusCode, headers, body });
        else
          reject(
            new Error(`Request failed. status: ${statusCode}, body: ${body}`)
          );
      });
    });

    req.on("error", (error) => reject(error));
    if (body) req.write(body);
    req.end();
  });
}

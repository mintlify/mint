import SwaggerParser from "@apidevtools/swagger-parser";
import { promises as _promises } from "fs";

const openApiCheck = async (
  path: string
): Promise<{ buffer: Buffer | undefined; isOpenApi: boolean }> => {
  let buffer = undefined;
  let isOpenApi = false;
  try {
    const api = await SwaggerParser.validate(path);
    buffer = Buffer.from(JSON.stringify(api, null, 2), "utf-8");
    isOpenApi = true;
  } catch {
    // not valid openApi
  }
  return { buffer, isOpenApi };
};

export default openApiCheck;

import SwaggerParser from "@apidevtools/swagger-parser";
import { promises as _promises } from "fs";

const openApiCheck = async (
  path: string
): Promise<{ openapi: any; isOpenApi: boolean }> => {
  let openapi;
  let isOpenApi = false;
  try {
    openapi = await SwaggerParser.validate(path);
    isOpenApi = true;
  } catch {
    // not valid openApi
  }
  return { openapi, isOpenApi };
};

export default openApiCheck;

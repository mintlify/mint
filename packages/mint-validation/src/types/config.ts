import { z } from "zod";
import { configSchema } from "../schemas/config";

export type ConfigType = z.infer<typeof configSchema>;

import { z } from "zod";
import { versionsSchema } from "../schemas/versions";

export type VersionsType = z.infer<typeof versionsSchema>;

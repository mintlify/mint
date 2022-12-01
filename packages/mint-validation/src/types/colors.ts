import { z } from "zod";
import { colorsSchema } from "@/schemas/colors";

export type ColorsType = z.infer<typeof colorsSchema>;

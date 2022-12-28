import { z } from "zod";
import { anchorsSchema } from "../schemas/anchors";

export type AnchorsType = z.infer<typeof anchorsSchema>;

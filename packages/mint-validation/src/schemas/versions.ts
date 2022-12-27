import { z } from "zod";

export const versionsSchema = z
  .array(
    z.string({ invalid_type_error: "Versions must be an array of strings." })
  )
  .min(
    1,
    "Versions array cannot be empty. Either delete the property or add strings to the array."
  );

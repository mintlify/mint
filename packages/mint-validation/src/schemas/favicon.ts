import { z } from "zod";

export const faviconSchema = z
  .string({
    invalid_type_error:
      "Favicon must be a string path pointing to the favicon file in your Mintlify folder.",
  })
  .refine((val) => val.split(".").pop() !== "ico", {
    message: "Favicon cannot be an .ico file.",
  });

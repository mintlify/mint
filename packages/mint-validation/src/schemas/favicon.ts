import { z } from "zod";

export const faviconSchema = z
  .string()
  .refine((val) => val.split(".").pop() !== "ico", {
    message: "Favicon cannot be an .ico file",
  });

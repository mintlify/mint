import { z } from "zod";

export const faviconSchema = z
  .string({
    required_error:
      "Favicon is missing. Please set favicon to the path of your favicon file. We recommend using a .svg or .png file. Mintlify automatically resizes your favicon to the sizes needed.",
    invalid_type_error:
      "Favicon must be a string path pointing to the favicon file in your Mintlify folder.",
  })
  .refine((val) => val.split(".").pop() !== "ico", {
    message: "Favicon cannot be an .ico file.",
  });

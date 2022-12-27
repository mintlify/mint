import { z } from "zod";
import { hexadecimalPattern } from "../utils/hexadecimalPattern";

export const anchorColorSchema = z.union([
  z
    .string({ invalid_type_error: "Anchor color must be a string." })
    .regex(hexadecimalPattern, "Anchor color must be a hexadecimal color."),
  z
    .object({
      from: z
        .string({
          invalid_type_error: "Anchor color.from must be a string.",
        })
        .regex(
          hexadecimalPattern,
          "Anchor color.from must be a hexadecimal color."
        ),
      via: z
        .string({
          invalid_type_error: "Anchor color.via must be a string.",
        })
        .regex(
          hexadecimalPattern,
          "Anchor color.via must be undefined or a hexadecimal color."
        )
        .optional(),
      to: z
        .string({
          invalid_type_error: "Anchor color.to must be a string.",
        })
        .regex(
          hexadecimalPattern,
          "Anchor color.to must be a hexadecimal color."
        ),
    })
    .strict(
      "Anchors with gradient colors can only have properties from, via, and to with valid hexadecimal colors."
    ),
]);

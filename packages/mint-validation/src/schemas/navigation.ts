import { z } from "zod";
import { NavigationType } from "../types/navigation";

const navigationSchema: z.ZodType<NavigationType> = z.lazy(() =>
  z
    .object(
      {
        group: z
          .string({ required_error: "Missing navigation group name." })
          .min(1, "Group cannot be an empty string."),
        pages: z.union([
          z.array(navigationSchema).min(1, "Pages array can't be empty."),
          z
            .array(z.string().min(1, "Page cannot be an empty string."))
            .min(1, "Pages array can't be empty."),
        ]),
        version: z
          .string({ invalid_type_error: "Version must be a string." })
          .optional(),
      },
      { invalid_type_error: "Navigation entry must be an object." }
    )
    .strict("Navigation entry can only contain group, pages, and version.")
);

export const navigationConfigSchema = z
  .array(navigationSchema, {
    required_error: "Navigation is missing.",
    invalid_type_error: "Navigation must be an array.",
  })
  .min(
    1,
    "Navigation cannot be an empty array. Please add at least one group."
  );

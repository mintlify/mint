import { z } from "zod";
import { NavigationType } from "../types/navigation";

const navigationSchema: z.ZodType<NavigationType> = z.lazy(() =>
  z
    .object(
      {
        // We allow top-level groups to be an empty string if the user wants to hide the title.
        // Future work should refactor this so nested groups are non-empty strings.
        group: z.string({
          required_error: "Missing navigation group name.",
          invalid_type_error:
            "Group must be a string. We use the group name to create the navigation sidebar.",
        }),
        pages: z
          .array(
            z.union([
              navigationSchema,
              z.string().min(1, "Page cannot be an empty string."),
            ])
          )
          .min(1, "Pages array can't be empty."),
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

import { configSchema } from "./schemas/config";
import { ConfigType } from "./types/config";
import { MintValidationResults } from "./utils/common";
import { flattenUnionErrorMessages } from "./utils/flattenUnionErrorMessages";
import { validateAnchorsWarnings } from "./utils/validateAnchorsWarnings";
import { validateVersionsInNavigation } from "./utils/validateVersionsInNavigation";

export function validateMintConfig(config: ConfigType): MintValidationResults {
  let results = new MintValidationResults();
  if (
    config == null ||
    config == undefined ||
    Object.entries(config).length === 0
  ) {
    results.errors.push("Mint Config object cannot be empty.");
    results.status = "error";
    return results;
  }

  // Specific warnings and errors
  const validateAnchorsWarningResult = validateAnchorsWarnings(config.anchors);
  const validateVersionsInNavigationResult = validateVersionsInNavigation(
    config.navigation,
    config.versions ?? []
  );

  results.errors = [
    ...results.errors,
    ...validateVersionsInNavigationResult.errors,
  ];

  results.warnings = [
    ...results.warnings,
    ...validateVersionsInNavigationResult.warnings,
    ...validateAnchorsWarningResult.warnings,
  ];

  // Global check
  const validateConfigResult = configSchema.safeParse(config);

  if (validateConfigResult.success == false) {
    const errors = validateConfigResult.error.issues;
    errors.forEach((e) => {
      if (e.code === "invalid_union" && e.unionErrors?.length > 0) {
        results.errors.push(
          ...flattenUnionErrorMessages(e.unionErrors as any[])
        );
      } else {
        let message = e.message;

        // Fallback if we forget to set a required_error
        if (message === "Required") {
          message = "Missing required field: " + e.path.join(".");
        }

        results.errors.push(message);
      }
    });
  }
  results.status = results.errors.length ? "error" : "success";
  return results;
}

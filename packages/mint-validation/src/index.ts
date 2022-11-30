import { configSchema } from "./schemas/config";
import { ConfigType } from "./types/config";
import { MintValidationResults } from "@/utils/common";
import { validateAnchorsWarnings } from "./utils/validateAnchorsWarnings";
import { validateVersionsInNavigation } from "./utils/validateVersionsInNavigation";

export function validateMintConfig(config: ConfigType): MintValidationResults {
  let results = new MintValidationResults();
  if (
    config == null ||
    config == undefined ||
    Object.entries(config).length === 0
  ) {
    results.errors.push("Config object cannot be empty");
    results.status = "error";
    return results;
  }

  // Specific warnings and errors
  const validateAnchorsWarningResult = validateAnchorsWarnings(config.anchors);
  results.warnings = [
    ...results.warnings,
    ...validateAnchorsWarningResult.warnings,
  ];
  const validateVersionsInNavigationResult = validateVersionsInNavigation(
    config.navigation,
    config.versions
  );
  results.errors = [
    ...results.errors,
    ...validateVersionsInNavigationResult.errors,
  ];
  // Global check
  const validateConfigResult = configSchema.safeParse(config);

  if (validateConfigResult.success == false) {
    const errors = validateConfigResult.error.issues;
    errors.forEach((e) => {
      results.errors = [...results.errors, e.message];
    });
  }
  results.status = results.errors.length ? "error" : "success";
  return results;
}

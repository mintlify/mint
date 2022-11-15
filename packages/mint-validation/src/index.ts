import { Config } from "../../../client/src/config";
import { validateNavigation } from "./utils/validateNavigation";
import { validateName } from "./utils/validateName";
import { validateFavicon } from "./utils/validateFavicon";
import { validateAnchors } from "./utils/validateAnchors";
import { validateColors } from "./utils/validateColors";
import { validateAnalytics } from "./utils/validateAnalytics";

export type MintValidation = {
  status: "success" | "error";
  warnings: string[];
  errors: string[];
};

export function validateMintConfig(config: Config): MintValidation {
  if (config == null) {
    return {
      status: "error",
      warnings: [],
      errors: ["Config object is null"],
    };
  }

  // TO DO: Verify config is an object and not a string, array, etc. If it is not an object, return an error.
  // TO DO: Write validation for other config fields.
  // Make each type of validation its own function under /utils/
  // 1. Name must be a string and cannot be missing.
  // 2. Favicon cannot be an .ico file, so verify the string doesn't end in .ico
  // 3. Each value in the array of anchors should have `url` set.
  // 4. Error if colors are invalid hexadecimal colors. They should look like: #EFEFEF.
  //    Letters bigger than F are always invalid. The # must always be included.
  // 5. Everything in config.analytics should follow this interface:
  //    https://mintlify.com/docs/site-stats/setup#enabling-analytics
  //    Some fields are optional, in those cases verify they are strings if set, but ignore them otherwise.
  // 6. If config.versions is set, it should be an array of strings. Error if there's an empty string or nulls.

  // TO DO: Improve this example navigation validation function.
  // Navigation is always an array of objects. Each object can be recursive though, for example:
  // navigation: [
  //  {
  //    group: "Group Name",
  //    pages: ["api-reference/api-page", { group: "Nested Group", pages: ["api-reference/nested-page"]}]
  //  }
  // ]
  // Notice how the pages can be a string OR another group.
  // Always warn if a page array is left empty.
  // If "version" is set on a group inside navigation, warn if the version doesn't exist in config.versions

  // Can we have more than one navigation array? according to the config type we can.
  const validateNavigationResult = validateNavigation(config.navigation);

  // TO DO: If multiple validation steps fail, merge the warnings and errors arrays.
  // You can probably keep appending all the messages to an array, then fall .flat() at the end.

  // const validateNameResult = validateName(config.name);
  // const validateFaviconResult = validateFavicon(config.favicon);
  // const validateAnchorsResult = validateAnchors(config.anchors);
  // const validateColorsResult = validateColors(config.colors);
  const validateAnalyticsResult = validateAnalytics(config.analytics);

  const mergedResults = {
    ...validateNavigationResult,
    ...validateAnalyticsResult,
  };

  return {
    status: mergedResults.errors.length ? "error" : "success",
    warnings: mergedResults.warnings,
    errors: mergedResults.errors,
  };
}

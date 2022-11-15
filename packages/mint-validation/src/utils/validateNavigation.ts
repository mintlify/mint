import { Navigation } from "../../../../client/src/config";

export function validateNavigation(navigation: Navigation[]) {
  if (navigation == null) {
    return {
      warnings: ["Navigation is missing"],
    };
  }

  if (!Array.isArray(navigation)) {
    return {
      errors: ["Navigation must be an array"],
    };
  }

  if (navigation.length === 0) {
    return {
      warnings: ["Navigation is an empty array, no pages will be shown"],
    };
  }

  // TODO: Go over all the navigation  and sub navigation objects checking the same conditions

  return {};
}

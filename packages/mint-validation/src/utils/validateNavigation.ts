export function validateNavigation(navigation: any) {
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

  return {};
}

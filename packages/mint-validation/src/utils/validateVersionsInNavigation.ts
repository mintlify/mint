import { NavigationEntry, NavigationType } from "../types/navigation";
import { VersionsType } from "../types/versions";
import { MintValidationResults } from "./common";

export function flattenNavigationVersions(
  nav: NavigationEntry[] | undefined,
  versions: string[] = []
): string[] {
  if (nav == null) {
    return [];
  }

  nav.forEach((val) => {
    if (val == null || typeof val === "string") {
      return versions;
    }

    if (val.version) {
      versions.push(val.version);
    }

    if (!Array.isArray(val.pages)) {
      return versions;
    }

    return flattenNavigationVersions(val.pages, versions);
  });

  return versions;
}

export function validateVersionsInNavigation(
  navigation: NavigationType[] | undefined,
  versions: VersionsType | undefined = []
) {
  let results = new MintValidationResults();

  const versionsFromNavigation = flattenNavigationVersions(navigation);
  versionsFromNavigation.forEach((v) => {
    if (!versions!.includes(v)) {
      results.errors.push(
        `Version ${v} is not included in the versions array, but is used in the navigation. Please add ${v} to the versions array.`
      );
    }
  });

  if (versionsFromNavigation.length === 0 && versions.length > 0) {
    results.warnings.push(
      "You have versions defined in the config, but no versions are used in the navigation."
    );
  }

  return results;
}

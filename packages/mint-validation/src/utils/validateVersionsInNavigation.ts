import { navigationConfigSchema } from "@/schemas/navigation";
import { versionsSchema } from "@/schemas/versions";
import { NavigationEntry, NavigationType } from "@/types/navigation";
import { VersionsType } from "@/types/versions";
import { MintValidationResults } from "./common";

export function flattenNavigationVersions(
  nav: NavigationEntry[],
  versions: string[] = []
): string[] {
  nav.forEach((val) => {
    if (typeof val === "string") {
      return versions;
    }

    if (val.version) {
      versions.push(val.version);
    }

    if (typeof val.pages === "string") {
      return versions;
    }

    return flattenNavigationVersions(val.pages, versions);
  });

  return versions;
}

export function validateVersionsInNavigation(
  navigation: NavigationType[],
  versions: VersionsType
) {
  let results = new MintValidationResults();

  const versionsFromNavigation = flattenNavigationVersions(navigation);
  versionsFromNavigation.forEach((v) => {
    if (!versions!.includes(v)) {
      results.errors.push(`Version ${v} is not valid`);
    }
  });

  return results;
}

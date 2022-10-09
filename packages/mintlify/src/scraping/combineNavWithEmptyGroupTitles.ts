import { Navigation } from "../navigation.js";

export default function combineNavWithEmptyGroupTitles(navArray: Navigation[]) {
  let newNavArray = [];

  navArray.forEach((nav: Navigation) => {
    // The first run through the loop will always have -1 as the index.
    // JavaScript returns undefined when we look for an index outside the size of the array.
    const prev = newNavArray[newNavArray.length - 1];
    if (prev == null) {
      newNavArray.push(nav);
    } else if (!nav.group && !prev.group) {
      // Joins multiple groups without a title together IF they occur side by side
      prev.pages = prev.pages.concat(nav.pages);
    } else {
      newNavArray.push(nav);
    }
  });

  return newNavArray;
}

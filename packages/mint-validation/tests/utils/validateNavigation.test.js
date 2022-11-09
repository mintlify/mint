import { validateNavigation } from "../../src/utils/validateNavigation";

test("validateNavigation returns a warning when navigation is empty", () => {
  const validationResults = validateNavigation([]);
  expect(validationResults.warnings.length).toEqual(1);
});

import { validateMintConfig } from "../src";

test("validateMintConfig returns error when missing config object", () => {
  const validationResults = validateMintConfig(null);
  expect(validationResults.status).toEqual("error");
});

import { validateMintConfig } from "../src";

test("validateMintConfig returns error when missing config object", () => {
  const results = validateMintConfig(null);
  expect(results.status).toEqual("error");
  expect(results.errors.length).toEqual(1);
});

test("validateMintConfig returns error when missing config object", () => {
  const results = validateMintConfig({});
  expect(results.status).toEqual("error");
  expect(results.errors.length).toEqual(1);
});

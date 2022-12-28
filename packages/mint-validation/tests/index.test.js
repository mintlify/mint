import { validateMintConfig } from "../src";

describe("validateMintConfig", () => {
  test("returns error when missing config object", () => {
    const results = validateMintConfig(null);
    expect(results.status).toEqual("error");
    expect(results.errors.length).toEqual(1);
  });

  test("returns error when missing config object", () => {
    const results = validateMintConfig({});
    expect(results.status).toEqual("error");
    expect(results.errors.length).toEqual(1);
  });
});

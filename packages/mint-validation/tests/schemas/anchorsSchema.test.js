import { anchorsSchema } from "../../src/schemas/anchors";

// test("validateAnchorsWarning returns a warning when anchors is empty", () => {
//   const data = analyticsSchema.safeParse([]);
//   expect(validationResults.warnings.length).toEqual(1);
//   expect(validationResults.errors.length).toEqual(0);
// });

// test("validateAnchors returns a warning when anchors is undefined", () => {
//   const validationResults = validateAnchors();
//   expect(validationResults.warnings.length).toEqual(1);
//   expect(validationResults.errors.length).toEqual(0);
// });

test("anchorsSchema returns an error when the url is missing", () => {
  const data = anchorsSchema.safeParse([
    { name: "a1", url: "" },
    { name: "a2", url: "someUrl" },
  ]);
  expect(data.success).toEqual(false);
});

test("anchorsSchema should return an error for each url missing", () => {
  const data = anchorsSchema.safeParse([
    { name: "a1", url: "" },
    { name: "a2", url: "" },
  ]);
  expect(data.success).toEqual(false);
});

test("anchorsSchema should returns success when everything is okay", () => {
  const data = anchorsSchema.safeParse([
    { name: "a1", url: "someRandomUrl" },
    { name: "a2", url: "someRandomUrl" },
  ]);
  expect(data.success).toEqual(true);
});

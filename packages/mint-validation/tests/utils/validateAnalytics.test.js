import { validateAnalytics } from "../../src/utils/validateAnalytics";

test("validateAnalytics works fine when analytics object is empty", () => {
  const validationResults = validateAnalytics({});
  expect(validationResults.errors.length).toEqual(0);
  expect(validationResults.status).toEqual("success");
  expect(validationResults.warnings.length).toEqual(0);
});

test("validateAnalytics works fine when one of the keys is set and all the values are there", () => {
  const validationResults = validateAnalytics({
    amplitude: { apiKey: "randomApiKey" },
  });
  expect(validationResults.errors.length).toEqual(0);
  expect(validationResults.status).toEqual("success");
  expect(validationResults.warnings.length).toEqual(0);
});

test("validateAnalytics works fine when one ore more of the keys is set and all the values are there", () => {
  const validationResults = validateAnalytics({
    amplitude: { apiKey: "randomApiKey" },
    ga4: { measurementId: "randomId" },
  });
  expect(validationResults.errors.length).toEqual(0);
  expect(validationResults.status).toEqual("success");
  expect(validationResults.warnings.length).toEqual(0);
});

test("validateAnalytics returns error when any of the keys is set but the value is missing", () => {
  const validationResults = validateAnalytics({ amplitude: {} });
  expect(validationResults.errors.length).toEqual(1);
  expect(validationResults.status).toEqual("error");
  expect(validationResults.warnings.length).toEqual(0);
});

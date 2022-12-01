import { analyticsSchema } from "../../src/schemas/analytics";

test("analyticsSchema works fine when analytics object is empty", () => {
  const data = analyticsSchema.safeParse({});
  expect(data.success).toEqual(true);
});

test("analyticsSchema works fine when analytics object is undefined", () => {
  const data = analyticsSchema.safeParse(undefined);
  expect(data.success).toEqual(true);
});

test("analyticsSchema works fine when one of the keys is set and all the values are there", () => {
  const data = analyticsSchema.safeParse({
    amplitude: { apiKey: "randomApiKey" },
  });
  expect(data.success).toEqual(true);
});

test("analyticsSchema works fine when one ore more of the keys is set and all the values are there", () => {
  const data = analyticsSchema.safeParse({
    amplitude: { apiKey: "randomApiKey" },
    ga4: { measurementId: "randomId" },
  });
  expect(data.success).toEqual(true);
});

test("analyticsSchema returns error when any of the keys is set but the value is missing", () => {
  const data = analyticsSchema.safeParse({ amplitude: {} });
  expect(data.success).toEqual(false);
});

test("analyticsSchema returns error when posthog apiHost does not start with http", () => {
  const data = analyticsSchema.safeParse({
    posthog: { apiKey: "randomKey", apiHost: "notHttp" },
  });
  expect(data.success).toEqual(false);
});

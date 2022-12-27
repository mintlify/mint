import { analyticsSchema } from "../../src/schemas/analytics";

describe("analyticsSchema", () => {
  test("works fine when analytics object is empty", () => {
    const data = analyticsSchema.safeParse({});
    expect(data.success).toEqual(true);
  });

  test("works fine when one of the keys is set and all the values are there", () => {
    const data = analyticsSchema.safeParse({
      amplitude: { apiKey: "randomApiKey" },
    });
    expect(data.success).toEqual(true);
  });

  test("works fine when one ore more of the keys is set and all the values are there", () => {
    const data = analyticsSchema.safeParse({
      amplitude: { apiKey: "randomApiKey" },
      ga4: { measurementId: "G-1234" },
    });
    expect(data.success).toEqual(true);
  });

  test("returns error when any of the keys is set but the value is missing", () => {
    const data = analyticsSchema.safeParse({ amplitude: {} });
    expect(data.success).toEqual(false);
  });

  test("returns error when posthog apiHost does not start with http", () => {
    const data = analyticsSchema.safeParse({
      posthog: { apiKey: "randomKey", apiHost: "notHttp" },
    });
    expect(data.success).toEqual(false);
  });

  test("returns error when plausible site starts with http", () => {
    const data = analyticsSchema.safeParse({
      plausible: { domain: "https://site.com" },
    });
    expect(data.success).toEqual(false);
    expect(data.error.errors[0].message).toEqual(
      "Plausible domain must not start with http:// or https://"
    );
  });
});

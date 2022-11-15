import { AnalyticsSchema, AnalyticsType } from "../schemas/analytics";
import { ValidationResults } from "./common";

export function validateAnalytics(analytics: AnalyticsType) {
  let results = new ValidationResults();

  const data = AnalyticsSchema.safeParse(analytics);
  if (data.success == false) {
    const errors = data.error.flatten();
    Object.values(errors.fieldErrors).forEach((e) => {
      results.errors = [...results.errors, ...e];
    });
    results.status = "error";
  }

  return results;
}

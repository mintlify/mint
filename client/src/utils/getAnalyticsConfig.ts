import { AnalyticsMediatorConstructorInterface } from '@/analytics/AnalyticsMediator';
import { Config } from '@/types/config';

export function getAnalyticsConfig(config: Config) {
  // If any values are in mint.json they override ALL injected values.
  // For example, setting the apiKey for PostHog also overrides the apiHost.
  let analyticsConfig: AnalyticsMediatorConstructorInterface = {};
  if (config?.__injected?.analytics) {
    analyticsConfig = constructAnalytics(config.__injected.analytics);
  }
  if (config?.analytics) {
    analyticsConfig = {
      ...analyticsConfig,
      ...constructAnalytics(config.analytics),
    };
  }
  console.log({ analyticsConfig });
  return analyticsConfig;
}
// Note: It's really bad we have to do this because the data we were sending was not clean.
// We added this as a sanity check to ensure analytics work as expected.
// We should investigate improving our mongoose schemas to make this unnecessary.
const constructAnalytics = (analytics: any): AnalyticsMediatorConstructorInterface => {
  const properlyTypedAnalytics: AnalyticsMediatorConstructorInterface = {};
  if (analytics?.amplitude?.apiKey) {
    properlyTypedAnalytics.amplitude = { apiKey: analytics.amplitude.apiKey };
  }
  if (analytics?.fathom?.siteId) {
    properlyTypedAnalytics.fathom = { siteId: analytics.fathom.siteId };
  }
  if (analytics?.ga4?.measurementId) {
    properlyTypedAnalytics.ga4 = { measurementId: analytics.ga4.measurementId };
  }
  if (analytics?.gtm?.tagId) {
    properlyTypedAnalytics.gtm = { tagId: analytics.gtm.tagId };
  }
  if (analytics?.hotjar?.hjid || analytics?.hotjar?.hjsv) {
    properlyTypedAnalytics.hotjar = {
      hjid: analytics?.hotjar?.hjid,
      hjsv: analytics?.hotjar?.hjsv,
    };
  }
  if (analytics?.logrocket?.appId) {
    properlyTypedAnalytics.logrocket = { appId: analytics.logrocket.appId };
  }
  if (analytics?.mixpanel?.projectToken) {
    properlyTypedAnalytics.mixpanel = { projectToken: analytics.mixpanel.projectToken };
  }
  if (analytics?.pirsch?.id) {
    properlyTypedAnalytics.pirsch = { id: analytics.pirsch.id };
  }
  if (analytics?.posthog?.apiKey) {
    properlyTypedAnalytics.posthog = { apiKey: analytics.posthog.apiKey };
  }
  if (analytics?.plausible?.domain) {
    properlyTypedAnalytics.plausible = { domain: analytics.plausible.domain };
  }
  return properlyTypedAnalytics;
};

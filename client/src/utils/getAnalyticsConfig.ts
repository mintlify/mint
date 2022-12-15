import { Config } from '@/types/config';

export function getAnalyticsConfig(config: Config) {
  // If any values are in mint.json they override ALL injected values.
  // For example, setting the apiKey for PostHog also overrides the apiHost.
  return {
    amplitude: config.analytics?.amplitude || config.__injected?.analytics?.amplitude,
    fathom: config.analytics?.fathom || config.__injected?.analytics?.fathom,
    ga4: config.analytics?.ga4 || config.__injected?.analytics?.ga4,
    gtm: config.analytics?.gtm || config.__injected?.analytics?.gtm,
    hotjar: config.analytics?.hotjar || config.__injected?.analytics?.hotjar,
    logrocket: config.analytics?.logrocket || config.__injected?.analytics?.logrocket,
    mixpanel: config.analytics?.mixpanel || config.__injected?.analytics?.mixpanel,
    pirsch: config.analytics?.pirsch || config.__injected?.analytics?.pirsch,
    posthog: config.analytics?.posthog || config.__injected?.analytics?.posthog,
    plausible: config.analytics?.plausible || config.__injected?.analytics?.plausible,
  };
}

import Router from 'next/router';
import posthog from 'posthog-js';

import {
  AbstractAnalyticsImplementation,
  ConfigInterface,
} from '@/analytics/AbstractAnalyticsImplementation';

export default class PostHogAnalytics extends AbstractAnalyticsImplementation {
  initialized = false;

  init(implementationConfig: ConfigInterface) {
    if (!implementationConfig.apiKey || process.env.NODE_ENV !== 'production') {
      return;
    }

    this.initialized = true;
    // apiHost only has to be passed in if the user is self-hosting PostHog
    posthog.init(implementationConfig.apiKey, {
      api_host: implementationConfig.apiHost || 'https://app.posthog.com',
      loaded: (posthogInstance) => {
        if (process.env.NODE_ENV !== 'production') posthogInstance.opt_out_capturing();
      },
    });

    // Track page views
    const handleRouteChange = () => posthog.capture('$pageview');
    Router.events.on('routeChangeComplete', handleRouteChange);
  }

  createEventListener(eventName: string) {
    if (this.initialized) {
      return async function capture(eventProperties: object) {
        posthog.capture(eventName, eventProperties);
      };
    }
    return async function doNothing(_: object) {};
  }
}

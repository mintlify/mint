import * as Sentry from '@sentry/nextjs';

import {
  AbstractAnalyticsImplementation,
  ConfigInterface,
} from '@/analytics/AbstractAnalyticsImplementation';

export default class MixpanelAnalytics extends AbstractAnalyticsImplementation {
  initialized = false;

  // Store events to submit after the library is loaded.
  waitTracking: { name: string; properties: object }[] = [];
  mixpanel = {
    track: (name: string, properties: object) => this.waitTracking.push({ name, properties }),
  } as any;

  init(implementationConfig: ConfigInterface) {
    if (implementationConfig.projectToken && process.env.NODE_ENV === 'production') {
      // Dynamic import reduces our First Load JS by 18 kB
      import('mixpanel-browser')
        .then((_mixpanel) => {
          if (!this.initialized) {
            // Get default module export
            const mixpanelLib = _mixpanel.default;
            mixpanelLib.init(implementationConfig.projectToken, {
              secure_cookie: true,
            });

            this.initialized = true;
            this.mixpanel = mixpanelLib;

            this.waitTracking.forEach((event) => {
              this.mixpanel.track(event.name, event.properties);
            });
          }
        })
        .catch((e) => {
          Sentry.captureException(e);
        });
    } else {
      // Stop storing events, we don't need them because the library will not be loaded.
      this.mixpanel.track = (_name: string, _properties: object) => {};
    }
  }

  createEventListener(eventName: string) {
    const captureFunc = async function capture(this: MixpanelAnalytics, eventProperties: object) {
      this.mixpanel.track(eventName, eventProperties);
    };
    return captureFunc.bind(this);
  }

  onRouteChange(url: string): void {
    this.mixpanel.track('pageview', {
      path: url,
    });
  }
}

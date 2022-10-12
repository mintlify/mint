import * as Sentry from '@sentry/nextjs';

import {
  AbstractAnalyticsImplementation,
  ConfigInterface,
} from '@/analytics/AbstractAnalyticsImplementation';

export default class LogrocketAnalytics extends AbstractAnalyticsImplementation {
  initialized = false;
  trackEvent: any;

  init(implementationConfig: ConfigInterface) {
    if (implementationConfig.appId && process.env.NODE_ENV === 'production') {
      import('logrocket')
        .then((_logrocket) => {
          if (!this.initialized) {
            _logrocket.init(implementationConfig.appId!);
            this.trackEvent = _logrocket.track;
            this.initialized = true;
          }
        })
        .catch((e) => {
          Sentry.captureException(e);
        });
    }
  }

  createEventListener(eventName: string) {
    if (this.initialized) {
      const trackEvent = this.trackEvent;
      return async function capture(eventProperties: object) {
        trackEvent(eventName, eventProperties);
      };
    }
    return async function doNothing(_: object) {};
  }
}

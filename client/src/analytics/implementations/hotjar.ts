import * as Sentry from '@sentry/nextjs';

import {
  AbstractAnalyticsImplementation,
  ConfigInterface,
} from '@/analytics/AbstractAnalyticsImplementation';

export default class HotjarAnalytics extends AbstractAnalyticsImplementation {
  initialized = false;

  // Store events to submit after the library is loaded.
  waitTracking: string[] = [];
  hotjar = {
    event: (name: string) => this.waitTracking.push(name),
  } as any;

  init(implementationConfig: ConfigInterface) {
    if (
      implementationConfig?.hjid &&
      implementationConfig?.hjsv &&
      process.env.NODE_ENV === 'production'
    ) {
      const hjid = parseInt(implementationConfig.hjid, 10);
      const hjsv = parseInt(implementationConfig.hjsv, 10);

      import('react-hotjar')
        .then((_hotjar) => {
          if (!this.initialized) {
            // Get default module export
            this.hotjar = _hotjar;
            this.hotjar.initialize(hjid, hjsv);
            this.initialized = true;

            this.waitTracking.forEach((eventName) => {
              this.hotjar.event(eventName);
            });
          }
        })
        .catch((e) => {
          Sentry.captureException(e);
        });
    }
  }

  createEventListener(eventName: string) {
    const captureFunc = async function capture(this: HotjarAnalytics, _: object) {
      this.hotjar.event(eventName);
    };
    return captureFunc.bind(this);
  }
}

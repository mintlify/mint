// IMPROVEMENT OPPORTUNITY: Figure out how to dynamically import
import LogRocket from 'logrocket';

import {
  AbstractAnalyticsImplementation,
  ConfigInterface,
} from '@/analytics/AbstractAnalyticsImplementation';

export default class LogrocketAnalytics extends AbstractAnalyticsImplementation {
  initialized = false;
  trackEvent: any;

  init(implementationConfig: ConfigInterface) {
    if (!implementationConfig.appId || process.env.NODE_ENV !== 'production') {
      return;
    }
    
    try {
      if (!this.initialized && implementationConfig.appId) {
        LogRocket.init(implementationConfig.appId);
        this.trackEvent = LogRocket.track;
        this.initialized = true;
      }
    } catch (e) {
      console.error(e);
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

import {
  AbstractAnalyticsImplementation,
  ConfigInterface,
} from '@/analytics/AbstractAnalyticsImplementation';

export default class GA4Analytics extends AbstractAnalyticsImplementation {
  measurementId: string | undefined;

  init(implementationConfig: ConfigInterface) {
    // GA4 setup happens by placing GA4Script.
    // This implementation only exists to send custom events using window.gtag.
    if (process.env.NODE_ENV === 'production') {
      this.measurementId = implementationConfig.measurementId;
    }
  }

  createEventListener(eventName: string) {
    if (this.measurementId && (window as any).gtag) {
      return async function capture(_: object) {
        (window as any).gtag('event', eventName, {});
      };
    }
    return async function doNothing(_: object) {};
  }

  onRouteChange(url: string): void {
    if (this.measurementId && (window as any).gtag) {
      (window as any).gtag('config', this.measurementId, {
        page_path: url,
      });
    }
  }
}

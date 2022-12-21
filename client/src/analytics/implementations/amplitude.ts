import {
  AbstractAnalyticsImplementation,
  ConfigInterface,
} from '@/analytics/AbstractAnalyticsImplementation';

export default class AmplitudeAnalytics extends AbstractAnalyticsImplementation {
  initialized = false;
  track: any;

  init(implementationConfig: ConfigInterface) {
    if (!implementationConfig?.apiKey || process.env.NODE_ENV !== 'production') {
      return;
    }

    import('@amplitude/analytics-browser')
      .then((_amplitude) => {
        if (!this.initialized) {
          _amplitude.init(implementationConfig.apiKey!);
          this.track = _amplitude.track;
          this.initialized = true;
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  createEventListener(eventName: string) {
    if (this.initialized && this.track) {
      const func = async function capture(this: AmplitudeAnalytics, eventProperties: object) {
        this.track(eventName, eventProperties);
      };
      return func.bind(this);
    }
    return async function doNothing(_: object) {};
  }

  onRouteChange(url: string, routeProps: any) {
    if (this.initialized && this.track && !routeProps.shallow) {
      this.track('page_view', { url });
    }
  }
}

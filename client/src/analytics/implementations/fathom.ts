import {
  AbstractAnalyticsImplementation,
  ConfigInterface,
} from '@/analytics/AbstractAnalyticsImplementation';

export default class FathomAnalytics extends AbstractAnalyticsImplementation {
  initialized = false;
  trackPageview: any;

  init(implementationConfig: ConfigInterface) {
    if (!implementationConfig.siteId || process.env.NODE_ENV !== 'production') {
      return;
    }

    import('fathom-client')
      .then((_fathom) => {
        if (!this.initialized) {
          _fathom.load(implementationConfig.siteId!);

          // The Fathom library uses asterisk imports (ie. * as Fathom)
          // so there is no default export for us to store a reference to.
          // Instead, we keep a reference to the method we need.
          this.trackPageview = _fathom.trackPageview;

          this.initialized = true;
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  onRouteChange(_: string, routeProps: any) {
    if (this.trackPageview && !routeProps.shallow) {
      this.trackPageview();
    }
  }
}

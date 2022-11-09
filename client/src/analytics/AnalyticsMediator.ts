import * as Sentry from '@sentry/nextjs';

import {
  AmplitudeConfigInterface,
  AbstractAnalyticsImplementation,
  AnalyticsMediatorInterface,
  FathomConfigInterface,
  HotjarConfigInterface,
  MixpanelConfigInterface,
  PostHogConfigInterface,
  GoogleAnalyticsConfigInterface,
  LogrocketConfigInterface,
  PirschConfigInterface,
} from '@/analytics/AbstractAnalyticsImplementation';
import PostHogAnalytics from '@/analytics/implementations/posthog';

import AmplitudeAnalytics from './implementations/amplitude';
import FathomAnalytics from './implementations/fathom';
import GA4Analytics from './implementations/ga4';
import HotjarAnalytics from './implementations/hotjar';
import LogrocketAnalytics from './implementations/logrocket';
import MixpanelAnalytics from './implementations/mixpanel';
import PirschAnalytics from './implementations/pirsch';

export type AnalyticsMediatorConstructorInterface = {
  amplitude?: AmplitudeConfigInterface;
  fathom?: FathomConfigInterface;
  ga4?: GoogleAnalyticsConfigInterface;
  logrocket?: LogrocketConfigInterface;
  hotjar?: HotjarConfigInterface;
  mixpanel?: MixpanelConfigInterface;
  pirsch?: PirschConfigInterface;
  posthog?: PostHogConfigInterface;
};

export default class AnalyticsMediator implements AnalyticsMediatorInterface {
  analyticsIntegrations: AbstractAnalyticsImplementation[] = [];

  constructor(analytics?: AnalyticsMediatorConstructorInterface) {
    // Ran first so we can assign the Sentry tags to false when not set.
    const amplitudeEnabled = Boolean(analytics?.amplitude?.apiKey);
    const fathomEnabled = Boolean(analytics?.fathom?.siteId);
    const ga4Enabled = Boolean(analytics?.ga4?.measurementId);
    const hotjarEnabled = Boolean(analytics?.hotjar?.hjid && analytics?.hotjar?.hjsv);
    const logrocketEnabled = Boolean(analytics?.logrocket?.appId);
    const mixpanelEnabled = Boolean(analytics?.mixpanel?.projectToken);
    const pirschEnabled = Boolean(analytics?.pirsch?.id);
    const posthogEnabled = Boolean(analytics?.posthog?.apiKey);
    Sentry.setTag('amplitude_enabled', `${amplitudeEnabled}`);
    Sentry.setTag('fathom_enabled', `${fathomEnabled}`);
    Sentry.setTag('ga4_enabled', `${ga4Enabled}`);
    Sentry.setTag('hotjar_enabled', `${hotjarEnabled}`);
    Sentry.setTag('logrocket_enabled', `${logrocketEnabled}`);
    Sentry.setTag('mixpanel_enabled', `${mixpanelEnabled}`);
    Sentry.setTag('pirschEnabled', `${pirschEnabled}`);
    Sentry.setTag('posthog_enabled', `${posthogEnabled}`);

    if (!analytics || Object.keys(analytics).length === 0) {
      return;
    }

    if (amplitudeEnabled) {
      const amplitude = new AmplitudeAnalytics();
      amplitude.init(analytics.amplitude!);
      this.analyticsIntegrations.push(amplitude);
    }

    if (fathomEnabled) {
      const fathom = new FathomAnalytics();
      fathom.init(analytics.fathom!);
      this.analyticsIntegrations.push(fathom);
    }

    if (ga4Enabled) {
      const ga4 = new GA4Analytics();
      ga4.init(analytics.ga4!);
      this.analyticsIntegrations.push(ga4);
    }

    if (hotjarEnabled) {
      const hotjar = new HotjarAnalytics();
      hotjar.init(analytics.hotjar!);
      this.analyticsIntegrations.push(hotjar);
    }

    if (logrocketEnabled) {
      const logrocket = new LogrocketAnalytics();
      logrocket.init(analytics.logrocket!);
      this.analyticsIntegrations.push(logrocket);
    }

    if (mixpanelEnabled) {
      const mixpanel = new MixpanelAnalytics();
      mixpanel.init(analytics.mixpanel!);
      this.analyticsIntegrations.push(mixpanel);
    }

    if (pirschEnabled) {
      const pirsch = new PirschAnalytics();
      pirsch.init(analytics.pirsch!);
      this.analyticsIntegrations.push(pirsch);
    }

    if (posthogEnabled) {
      const posthog = new PostHogAnalytics();
      posthog.init(analytics.posthog!);
      this.analyticsIntegrations.push(posthog);
    }
  }

  createEventListener(eventName: string) {
    const listeners = this.analyticsIntegrations.map((integration) =>
      integration.createEventListener(eventName)
    );
    return async function (eventConfig: object) {
      listeners.forEach((listener) => listener(eventConfig));
    };
  }

  onRouteChange(url: string, routeProps: any) {
    this.analyticsIntegrations.forEach((integration) => integration.onRouteChange(url, routeProps));
  }
}

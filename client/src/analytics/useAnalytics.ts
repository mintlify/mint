import Router from 'next/router';
import { useState, useEffect } from 'react';

import { AnalyticsMediatorInterface } from '@/analytics/AbstractAnalyticsImplementation';
import AnalyticsMediator from '@/analytics/AnalyticsMediator';
import { AnalyticsMediatorConstructorInterface } from '@/analytics/AnalyticsMediator';
import FakeAnalyticsMediator from '@/analytics/FakeAnalyticsMediator';

/**
 * This hook is and should continue to be the only way to create an AnalyticsMediator.
 * This allows us to guarantee code like onRouteChange is always run correctly without managing tons of callsites.
 * We need useEffect which requires this code to be a hook. All hook names must start with use.
 * @param config Site config to extract analytics settings from
 */
export function useAnalytics(analyticsConfig: AnalyticsMediatorConstructorInterface) {
  const [initializedAnalyticsMediator, setInitializedAnalyticsMediator] = useState(false);
  const [analyticsMediator, setAnalyticsMediator] = useState<AnalyticsMediatorInterface>(
    new FakeAnalyticsMediator()
  );

  // AnalyticsMediator can only run in the browser
  // We use useEffect because it only runs on render
  useEffect(() => {
    if (!initializedAnalyticsMediator) {
      const newMediator = new AnalyticsMediator(analyticsConfig);
      setAnalyticsMediator(newMediator);
      setInitializedAnalyticsMediator(true);
    }
  }, [initializedAnalyticsMediator, analyticsConfig]);

  useEffect(() => {
    Router.events.on('routeChangeComplete', (url: string, routeProps: any) => {
      analyticsMediator.onRouteChange(url, routeProps);
    });
  }, [analyticsMediator]);

  return analyticsMediator;
}

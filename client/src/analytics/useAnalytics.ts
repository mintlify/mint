import Router from 'next/router';
import { useState, useEffect } from 'react';

import { AnalyticsMediatorInterface } from '@/analytics/AbstractAnalyticsImplementation';
import AnalyticsMediator from '@/analytics/AnalyticsMediator';
import { AnalyticsMediatorConstructorInterface } from '@/analytics/AnalyticsMediator';
import FakeAnalyticsMediator from '@/analytics/FakeAnalyticsMediator';

/**
 * useAnalytics is the only way to create an AnalyticsMediator. Trying to create an
 * AnalyticsMediator without this hook will break because code like onRouteChange will
 * never be called.
 * @param analyticsConfig Config for each analytics implementation
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

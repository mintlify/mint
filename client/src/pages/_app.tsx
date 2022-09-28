import ProgressBar from '@badrap/bar-of-progress';
import { ResizeObserver } from '@juggle/resize-observer';
import 'focus-visible';
import 'intersection-observer';
import Head from 'next/head';
import Router from 'next/router';
import { useState, useEffect } from 'react';

import { AnalyticsMediatorInterface } from '@/analytics/AbstractAnalyticsImplementation';
import AnalyticsContext from '@/analytics/AnalyticsContext';
import AnalyticsMediator from '@/analytics/AnalyticsMediator';
import FakeAnalyticsMediator from '@/analytics/FakeAnalyticsMediator';
import { config } from '@/config';
import { DocumentationLayout } from '@/layouts/DocumentationLayout';
import { documentationNav, findPageInGroup, PageContext, nonMetaTags } from '@/nav';
import { Header } from '@/ui/Header';
import { SearchProvider } from '@/ui/Search';
import { Title } from '@/ui/Title';
import '@/utils/fontAwesome';
import getAnalyticsConfig from '@/utils/getAnalyticsConfig';

import '../css/fonts.css';
import '../css/main.css';

if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  window.ResizeObserver = ResizeObserver;
}

const progress = new ProgressBar({
  size: 2,
  color: config?.colors?.primary ?? '#0C8C5E',
  className: 'bar-of-progress',
  delay: 100,
});

// this fixes safari jumping to the bottom of the page
// when closing the search modal using the `esc` key
if (typeof window !== 'undefined') {
  progress.start();
  progress.finish();
}

Router.events.on('routeChangeStart', () => progress.start());
Router.events.on('routeChangeComplete', () => progress.finish());
Router.events.on('routeChangeError', () => progress.finish());

export default function App(props: any) {
  const { Component, pageProps, router } = props;
  const [initializedAnalyticsMediator, setInitializedAnalyticsMediator] = useState(false);
  const [analyticsMediator, setAnalyticsMediator] = useState<AnalyticsMediatorInterface>(
    new FakeAnalyticsMediator()
  );

  // AnalyticsMediator can only run in the browser
  // We use useEffect because it only runs on render
  useEffect(() => {
    if (!initializedAnalyticsMediator) {
      const newMediator = new AnalyticsMediator(getAnalyticsConfig(config));
      setAnalyticsMediator(newMediator);
      setInitializedAnalyticsMediator(true);
    }
  }, [initializedAnalyticsMediator]);

  let [navIsOpen, setNavIsOpen] = useState(false);

  useEffect(() => {
    Router.events.on('routeChangeComplete', (url: string, routeProps: any) => {
      analyticsMediator.onRouteChange(url, routeProps);
    });
  }, [analyticsMediator]);

  useEffect(() => {
    if (!navIsOpen) return;
    function handleRouteChange() {
      setNavIsOpen(false);
    }
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [navIsOpen]);

  let section = undefined;
  let meta: PageContext = {};
  documentationNav.forEach((group) => {
    const foundPage = findPageInGroup(group, router.pathname);
    if (foundPage) {
      section = foundPage.group;
      meta = foundPage.page;
      return false;
    }
    return true;
  });
  const metaTags = meta;
  nonMetaTags.forEach((nonMetaTag) => {
    delete metaTags[nonMetaTag as keyof PageContext];
  });
  return (
    <AnalyticsContext.Provider value={analyticsMediator}>
      <Title suffix={config.name}>{meta.sidebarTitle || meta.title}</Title>
      <Head>
        {Object.entries(metaTags).map(([key, value]) => (
          <meta key={key} name={key} content={value} />
        ))}
      </Head>
      <SearchProvider>
        <Header
          hasNav={Boolean(config.navigation?.length)}
          navIsOpen={navIsOpen}
          onNavToggle={(isOpen: boolean) => setNavIsOpen(isOpen)}
          title={meta?.title}
          section={section}
        />
        <DocumentationLayout
          isMdx={pageProps?.isMdx}
          navIsOpen={navIsOpen}
          setNavIsOpen={setNavIsOpen}
          meta={meta}
        >
          <Component section={section} meta={meta} />
        </DocumentationLayout>
      </SearchProvider>
    </AnalyticsContext.Provider>
  );
}

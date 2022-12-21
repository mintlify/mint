export type AmplitudeConfigInterface = {
  apiKey?: string;
};

export type FathomConfigInterface = {
  siteId?: string;
};

export type GoogleAnalyticsConfigInterface = {
  measurementId?: string;
};

export type GoogleTagManagerConfigInterface = {
  tagId?: string;
};

export type HotjarConfigInterface = {
  hjid?: string;
  hjsv?: string;
};

export type LogrocketConfigInterface = {
  appId?: string;
};

export type MixpanelConfigInterface = {
  projectToken?: string;
};

export type PirschConfigInterface = {
  id?: string;
};

export type PostHogConfigInterface = {
  apiKey?: string;
  apiHost?: string;
};

export type PlausibleInterface = {
  domain?: string;
};

// We can use & instead of | because all keys are optional
export type ConfigInterface = AmplitudeConfigInterface &
  FathomConfigInterface &
  GoogleAnalyticsConfigInterface &
  GoogleTagManagerConfigInterface &
  HotjarConfigInterface &
  LogrocketConfigInterface &
  MixpanelConfigInterface &
  PirschConfigInterface &
  PostHogConfigInterface &
  PlausibleInterface;

// TypeScript doesn't recommend setting interfaces on constructors.
// How an object is constructed should not matter because an interface
// only cares about what it does.
export abstract class AbstractAnalyticsImplementation {
  // New implementations need their own config interface.
  abstract init(implementationConfig: ConfigInterface): void;
  createEventListener(eventName: string): (eventProperties: object) => Promise<void> {
    return async function doNothing(_: object) {};
  }
  onRouteChange(url: string, routeProps: any): void {}
}

export type AnalyticsMediatorInterface = {
  createEventListener: (eventName: string) => (eventConfig: object) => Promise<void>;
  onRouteChange: (url: string, routeProps: any) => void;
};

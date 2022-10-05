import { Config } from '@/config';

export default function getLogoHref(configJSON: Config) {
  if (configJSON?.logoHref) {
    return configJSON.logoHref;
  }

  if (typeof configJSON?.logo === 'string') {
    return '/';
  }

  return configJSON?.logo?.href ?? '/';
}

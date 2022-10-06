import { Config } from '@/config';

export default function getLogoHref(configJSON: Config) {
  if (typeof configJSON?.logo === 'string') {
    return '/';
  }

  return configJSON?.logo?.href ?? '/';
}

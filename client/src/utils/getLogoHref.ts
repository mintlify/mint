import { Config } from '@/types/config';

export default function getLogoHref(configJSON: Config) {
  if (typeof configJSON?.logo === 'string') {
    return '/';
  }

  return configJSON?.logo?.href ?? '/';
}

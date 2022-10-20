import clsx from 'clsx';
import Image from 'next/image';

import { config } from '@/types/config';

export function Logo() {
  const className = clsx('w-auto h-7 relative', config.classes?.logo);
  if (typeof config.logo === 'object' && config.logo !== null) {
    return (
      <>
        <div className={clsx(className, 'block dark:hidden')}>
          <Image
            src={config?.logo.light}
            alt="light logo"
            layout="fill"
            objectFit="contain"
            objectPosition="left"
          />
        </div>
        <div className={clsx(className, 'hidden dark:block')}>
          <Image
            src={config?.logo.dark}
            alt="dark logo"
            layout="fill"
            objectFit="contain"
            objectPosition="left"
          />
        </div>
      </>
    );
  }
  if (config?.logo) {
    return (
      <div className={clsx(className)}>
        <Image
          src={config?.logo}
          alt="logo"
          layout="fill"
          objectFit="contain"
          objectPosition="left"
        />
      </div>
    );
  }
  if (config?.name) {
    return (
      <div
        className={`inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200 ${className}`}
      >
        {config?.name}
      </div>
    );
  }
  return <></>;
}

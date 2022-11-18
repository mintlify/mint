import clsx from 'clsx';
import { useContext } from 'react';

import { ConfigContext } from '@/context/ConfigContext';

export function Logo() {
  const { config } = useContext(ConfigContext);
  const className = 'w-auto h-7 relative';
  if (typeof config?.logo === 'object' && config.logo !== null) {
    return (
      <>
        <img
          className={clsx(className, 'block dark:hidden')}
          src={config?.logo.light}
          alt="light logo"
        />
        <img
          className={clsx(className, 'hidden dark:block')}
          src={config?.logo.dark}
          alt="dark logo"
        />
      </>
    );
  }
  if (config?.logo) {
    return <img className={clsx(className)} src={config?.logo} alt="logo" />;
  }
  if (config?.name) {
    return (
      <div
        className={clsx(
          'inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200',
          className
        )}
      >
        {config?.name}
      </div>
    );
  }
  return <></>;
}

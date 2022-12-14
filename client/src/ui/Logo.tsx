import clsx from 'clsx';
import { useContext } from 'react';

import { ConfigContext } from '@/context/ConfigContext';

export function Logo() {
  const { mintConfig } = useContext(ConfigContext);
  const className = 'w-auto h-7 relative';
  if (typeof mintConfig?.logo === 'object' && mintConfig.logo !== null) {
    return (
      <>
        <img
          className={clsx(className, 'block dark:hidden')}
          src={mintConfig?.logo.light}
          alt="light logo"
        />
        <img
          className={clsx(className, 'hidden dark:block')}
          src={mintConfig?.logo.dark}
          alt="dark logo"
        />
      </>
    );
  }
  if (mintConfig?.logo) {
    return <img className={clsx(className)} src={mintConfig?.logo} alt="logo" />;
  }
  if (mintConfig?.name) {
    return (
      <div
        className={clsx(
          'inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200',
          className
        )}
      >
        {mintConfig?.name}
      </div>
    );
  }
  return <></>;
}

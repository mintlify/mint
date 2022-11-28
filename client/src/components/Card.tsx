import { Card as GenericCard } from '@mintlify/components';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import React from 'react';

import { ComponentIcon } from '@/ui/Icon';

export function Card({
  title,
  icon,
  iconType,
  color,
  href,
  children,
}: {
  title?: string;
  icon?: ReactNode | string;
  iconType?: string;
  color?: string;
  href?: string;
  children?: React.ReactNode;
}) {
  const Icon =
    typeof icon === 'string' ? (
      <ComponentIcon
        icon={icon}
        iconType={iconType as any}
        color={color}
        className="h-6 w-6 bg-primary dark:bg-primary-light"
        overrideColor
      />
    ) : (
      icon
    );

  const CardComponent = ({ href }: { href?: string }) => (
    <GenericCard
      className={clsx(
        // We need to set these as important because mint adds an underline to links with a border
        // that overrides our own border color.
        '!border-slate-200 dark:!border-slate-800',
        href && 'hover:!border-primary dark:hover:!border-primary-light'
      )}
      title={title}
      icon={Icon}
      href={href}
    >
      {children}
    </GenericCard>
  );

  // We don't use DynamicLink because we cannot wrap the Card in an extra <a> tag without
  // messing with the Card's styling. The Card already sets an <a> tag when href is passed to it.
  if ((href && href?.startsWith('/')) || href?.startsWith('#')) {
    return (
      <Link href={href} passHref>
        <CardComponent />
      </Link>
    );
  }

  return <CardComponent href={href} />;
}

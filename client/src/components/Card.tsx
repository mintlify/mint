import { Card as GenericCard } from '@mintlify/components';
import clsx from 'clsx';
import { ReactNode } from 'react';

import { ComponentIcon } from '@/ui/Icon';

import { DynamicLink } from './DynamicLink';

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
  children: React.ReactNode;
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

  const Card = () => (
    <GenericCard
      className={clsx(href && 'hover:border-primary dark:hover:border-primary-light')}
      title={title}
      icon={Icon}
    >
      {children}
    </GenericCard>
  );

  if (href) {
    return (
      <div className="not-prose">
        <DynamicLink href={href}>
          <Card />
        </DynamicLink>
      </div>
    );
  }

  return <Card />;
}

import { Card as GenericCard } from '@mintlify/components';
import clsx from 'clsx';
import isAbsoluteUrl from 'is-absolute-url';
import Link from 'next/link';
import { ReactNode } from 'react';

import { ComponentIcon } from '@/ui/Icon';

function DynamicLink({ href, children }: { href: string; children?: ReactNode }) {
  if (href && isAbsoluteUrl(href)) {
    return <span className="not-prose">{children}</span>;
  }

  // next/link is used for internal links to avoid extra network calls
  return (
    <span className="not-prose">
      <Link href={href} passHref={true}>
        {children}
      </Link>
    </span>
  );
}

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
      href={href}
    >
      {children}
    </GenericCard>
  );

  if (href) {
    return (
      <DynamicLink href={href}>
        <Card />
      </DynamicLink>
    );
  }

  return <Card />;
}

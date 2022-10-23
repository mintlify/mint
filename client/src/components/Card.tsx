import { Card as GenericCard } from '@mintlify/components';
import isAbsoluteUrl from 'is-absolute-url';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

import { config } from '@/config';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { ComponentIcon } from '@/ui/Icon';

function DynamicLink(props: any) {
  if (props.href && isAbsoluteUrl(props.href)) {
    return (
      <span className="not-prose">
        <a {...props} target="_blank" rel="noopener" />
      </span>
    );
  }
  return <Link {...props} />;
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>();
  useIsomorphicLayoutEffect(() => {
    if (window.document.querySelector('html.dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const activeConfigColor = isDarkMode ? config.colors?.light : config.colors?.primary;

  const Icon =
    typeof icon === 'string' ? (
      <ComponentIcon
        icon={icon}
        iconType={iconType as any}
        color={color || activeConfigColor}
        className="h-6 w-6"
      />
    ) : (
      icon
    );

  const Card = ({ forwardHref, onClick }: { forwardHref?: string; onClick?: any }) => (
    <GenericCard
      title={title}
      icon={Icon}
      hoverHighlightColour={href ? color || activeConfigColor : undefined}
      href={forwardHref}
      onClick={onClick}
    >
      {children}
    </GenericCard>
  );

  // next/link is used for internal links to avoid extra network calls
  if (href) {
    return (
      <DynamicLink href={href} passHref={true}>
        <Card />
      </DynamicLink>
    );
  }

  return <Card forwardHref={href} />;
}

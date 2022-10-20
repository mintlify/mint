import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Card as GenericCard } from '@mintlify/components';
import isAbsoluteUrl from 'is-absolute-url';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { config } from '@/types/config';

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
  color,
  href,
  children,
}: {
  title?: string;
  icon?: ReactNode | IconDefinition;
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

  const Card = ({ forwardHref, onClick }: { forwardHref?: string; onClick?: any }) => (
    <GenericCard
      title={title}
      icon={icon}
      iconColor={color || activeConfigColor}
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

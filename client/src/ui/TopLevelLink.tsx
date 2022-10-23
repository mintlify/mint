import clsx from 'clsx';
import Link from 'next/link';
import { forwardRef } from 'react';

import { config } from '@/config';
import {
  getAnchorBackgroundColor,
  getAnchorHoverBackgroundColor,
  getAnchorShadowColor,
  getAnchorTextColor,
} from '@/utils/brands';
import { isBrandFontAwesomeIcon } from '@/utils/fontAwesome';

import Icon from './Icon';

type TopLevelProps = {
  href: string;
  i: number;
  isActive: boolean;
  children?: any;
  className?: string;
  color?: string;
  onClick?: (el: any) => void;
  icon?: any;
  shadow?: string;
  mobile?: boolean;
  name?: string;
  as?: string;
};

const TopLevelAnchor = forwardRef(
  ({ children, href, className, icon, isActive, onClick, color, i }: TopLevelProps, ref: any) => {
    const activeBackgroundColor =
      config.classes?.activeAnchors ?? getAnchorBackgroundColor(i, color);
    const hoverBackgroundColor = config.classes?.anchors ?? getAnchorHoverBackgroundColor(i, color);
    const shadowColor = getAnchorShadowColor(i, color);
    return (
      <li>
        <a
          ref={ref}
          href={href}
          onClick={onClick}
          className={clsx(
            'group flex items-center lg:text-sm lg:leading-6',
            className,
            isActive
              ? ['font-semibold', getAnchorTextColor(i, color)]
              : 'font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
          )}
        >
          <div
            className={clsx(
              `mr-4 rounded-md ring-slate-900/5 group-hover:ring-slate-900/10 dark:group-hover:highlight-white/10 p-1`,
              shadowColor || 'shadow-primary/40',
              hoverBackgroundColor,
              isActive
                ? [activeBackgroundColor, 'highlight-slate-700/10 dark:highlight-white/10']
                : 'bg-slate-300 highlight-slate-700/5 dark:bg-slate-800 dark:highlight-white/5'
            )}
          >
            {icon}
          </div>
          {children}
        </a>
      </li>
    );
  }
);

export function TopLevelLink({ ...props }: TopLevelProps) {
  const { href, as } = props;
  if (/^https?:\/\//.test(href)) {
    return <TopLevelAnchor {...props} />;
  }

  return (
    <Link href={href} as={as} passHref>
      <TopLevelAnchor {...props} />
    </Link>
  );
}

export function StyledTopLevelLink({
  href,
  as,
  name,
  icon,
  color,
  isActive,
  i,
  ...props
}: TopLevelProps) {
  const isBrandIcon = isBrandFontAwesomeIcon(icon);
  const iconType = isBrandIcon ? 'brands' : 'duotone';
  const AnchorIcon =
    icon == null ? (
      <div className="h-6 w-px"></div>
    ) : (
      <Icon
        icon={icon.toLowerCase()}
        iconType={iconType}
        className={clsx(
          `h-4 w-4 bg-white secondary-opacity group-hover:fill-primary-dark dark:group-hover:bg-white`,
          isActive ? 'dark:bg-white' : 'dark:bg-slate-500',
          color == null && 'dark:group-hover:bg-white'
        )}
      />
    );
  return (
    <TopLevelLink
      {...props}
      as={as}
      href={href}
      className="mb-4"
      icon={AnchorIcon}
      isActive={isActive}
      color={color}
      i={i}
    >
      {name ?? href}
    </TopLevelLink>
  );
}

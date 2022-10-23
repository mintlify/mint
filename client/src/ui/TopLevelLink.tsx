import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Link from 'next/link';
import { forwardRef, useContext } from 'react';

import SiteContext from '@/context/SiteContext';
import {
  getAnchorBackgroundColor,
  getAnchorHoverBackgroundColor,
  getAnchorShadowColor,
  getAnchorTextColor,
} from '@/utils/brands';
import { isBrandFontAwesomeIcon } from '@/utils/fontAwesome';

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
    const { config } = useContext(SiteContext);
    const activeBackgroundColor =
      config?.classes?.activeAnchors ?? getAnchorBackgroundColor(i, color);
    const hoverBackgroundColor =
      config?.classes?.anchors ?? getAnchorHoverBackgroundColor(i, color);
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
              `mr-4 rounded-md ring-slate-900/5 group-hover:ring-slate-900/10 dark:group-hover:highlight-white/10`,
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
  const iconPrefix = isBrandIcon ? 'fab' : 'fad';
  const Icon =
    icon == null ? (
      <div className="h-6 w-px"></div>
    ) : (
      <FontAwesomeIcon
        className={clsx(
          `h-6 w-6 p-1 text-white secondary-opacity group-hover:fill-primary-dark dark:group-hover:text-white`,
          isBrandIcon && 'fa-secondary',
          isActive ? 'dark:text-white' : 'dark:text-slate-500',
          color == null && 'dark:group-hover:text-white'
        )}
        icon={[iconPrefix, icon.toLowerCase()]}
      />
    );
  return (
    <TopLevelLink
      {...props}
      as={as}
      href={href}
      className="mb-4"
      icon={Icon}
      isActive={isActive}
      color={color}
      i={i}
    >
      {name ?? href}
    </TopLevelLink>
  );
}

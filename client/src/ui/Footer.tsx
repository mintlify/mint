import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

import { isBrandsIcon } from '@/ui/Icon';

import { config } from '../config';
import Icon from './Icon';

type FooterProps = {
  children?: React.ReactChild;
  previous?: any;
  next?: any;
  hasBottomPadding?: boolean;
};

type SocialProps = {
  type?: string;
  url: string;
};

const Social = ({ type, url }: SocialProps) => {
  let icon = type === 'website' || type == null ? 'earth-americas' : type;
  if (
    icon !== 'earth-americas' &&
    icon !== 'discord' &&
    icon !== 'facebook' &&
    icon !== 'slack' &&
    icon !== 'twitter' &&
    icon !== 'github' &&
    icon !== 'linkedin' &&
    icon !== 'instagram' &&
    icon !== 'youtube' &&
    icon !== 'medium' &&
    icon !== 'hacker-news'
  ) {
    return null;
  }

  const iconType = isBrandsIcon(type) ? 'brands' : 'solid';
  return (
    <a href={url}>
      <span className="sr-only">{type}</span>
      <Icon
        icon={icon}
        iconType={iconType}
        className="h-5 w-5 bg-slate-400 dark:bg-slate-500 hover:bg-slate-500 dark:hover:bg-slate-400"
      />
    </a>
  );
};

export function Footer({ previous, next, hasBottomPadding = true }: FooterProps) {
  return (
    <footer className={clsx('text-sm leading-6', previous || next ? 'mt-12' : 'mt-16')}>
      {(previous || next) && (
        <div className="mb-10 text-slate-700 font-semibold flex items-center dark:text-slate-200">
          {previous && (
            <Link href={previous.href}>
              <a className="group flex items-center hover:text-slate-900 dark:hover:text-white">
                <svg
                  viewBox="0 0 3 6"
                  className="mr-3 w-auto h-1.5 text-slate-400 overflow-visible group-hover:text-slate-600 dark:group-hover:text-slate-300"
                >
                  <path
                    d="M3 0L0 3L3 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {previous.title}
              </a>
            </Link>
          )}
          {next && (
            <Link href={next.href}>
              <a className="group ml-auto flex items-center hover:text-slate-900 dark:hover:text-white">
                {next.title}
                <svg
                  viewBox="0 0 3 6"
                  className="ml-3 w-auto h-1.5 text-slate-400 overflow-visible group-hover:text-slate-600 dark:group-hover:text-slate-300"
                >
                  <path
                    d="M0 0L3 3L0 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </Link>
          )}
        </div>
      )}
      <div
        className={clsx(
          'pt-10 border-t border-slate-200 sm:flex justify-between text-slate-500 dark:border-slate-200/5',
          { 'pb-28': hasBottomPadding }
        )}
      >
        <div className="mb-6 sm:mb-0 sm:flex">
          <p>
            <Link href="https://mintlify.com">
              <a target="_blank" className="hover:text-slate-900 dark:hover:text-slate-400">
                Powered by Mintlify
              </a>
            </Link>
          </p>
        </div>
        <div className="flex space-x-6">
          {config?.footerSocials &&
            Array.isArray(config.footerSocials) &&
            config.footerSocials.map((social) => (
              <Social key={social.url} url={social.url} type={social?.type} />
            ))}
          {config?.footerSocials &&
            typeof config.footerSocials === 'object' &&
            Object.entries(config.footerSocials).map(([socialType, socialUrl]) => (
              <Social key={socialUrl} url={socialUrl} type={socialType} />
            ))}
        </div>
      </div>
    </footer>
  );
}

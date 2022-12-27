import Link from 'next/link';

export function DynamicLink({
  href,
  ref,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
  className,
  children,
}: {
  href?: string;
  ref: any;
  onClick?: (el: any) => void;
  onMouseEnter?: any;
  onMouseLeave?: any;
  style?: any;
  className?: string;
  children?: any;
}) {
  if (href?.startsWith('/') || href?.startsWith('#')) {
    // next/link is used for internal links to avoid extra network calls
    return (
      <Link
        href={href}
        ref={ref}
        passHref={true}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={style}
        className={className}
      >
        {children}
      </Link>
    );
  }

  if (href?.startsWith('./') || href?.startsWith('../')) {
    // Cannot use a Link, it doesn't work because it would be relative to the [[...slug]] file
    return (
      <a
        href={href}
        ref={ref}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={style}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      ref={ref}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
      className={className}
    >
      {children}
    </a>
  );
}

import Link from 'next/link';

export function DynamicLink({ href, children }: { href?: string; children?: any }) {
  if (href?.startsWith('/') || href?.startsWith('#')) {
    // next/link is used for internal links to avoid extra network calls
    return (
      <Link href={href} passHref={true}>
        {children}
      </Link>
    );
  }

  if (href?.startsWith('./') || href?.startsWith('../')) {
    // Cannot use a Link, it doesn't work because it would be relative to the [[...slug]] file
    return <a href={href}>{children}</a>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

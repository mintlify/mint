import Link from 'next/link';

export function DynamicLink(props: any) {
  if ((props.href && props.href.startsWith('/')) || props.href.startsWith('#')) {
    // next/link is used for internal links to avoid extra network calls
    return (
      <Link href={props.href} passHref={true}>
        <a>{props.children}</a>
      </Link>
    );
  }

  return (
    <a href={props.href} target="_blank" rel="noreferrer">
      {props.children}
    </a>
  );
}

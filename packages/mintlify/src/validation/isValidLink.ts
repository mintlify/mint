export default function isValidLink(href: string) {
  // This checks the link is written correctly, not that the page exists.
  try {
    new URL(href);
    return true;
  } catch (_) {
    return false;
  }
}

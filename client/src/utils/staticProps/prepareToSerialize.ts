/**
 * getStaticProps serializes the props we pass and cannot handle undefined values.
 * Stringifying and immediately parsing the string removes undefined values quickly.
 * Nulls are still included. NaNs get turned into null.
 */
export function prepareToSerialize(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

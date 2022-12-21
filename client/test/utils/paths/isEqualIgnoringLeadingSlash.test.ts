import { isEqualIgnoringLeadingSlash } from '@/utils/paths/leadingSlashHelpers';

describe('isEqualIgnoringLeadingSlash', () => {
  test('false when non-string inputs are passed', () => {
    expect(isEqualIgnoringLeadingSlash({}, {})).toEqual(false);
    expect(isEqualIgnoringLeadingSlash(undefined, '')).toEqual(false);
    expect(isEqualIgnoringLeadingSlash(0, null)).toEqual(false);
  });

  test('true when strings match ignoring leading slash', () => {
    expect(isEqualIgnoringLeadingSlash('', '/')).toEqual(true);
    expect(isEqualIgnoringLeadingSlash('/path/to', 'path/to')).toEqual(true);
  });
});

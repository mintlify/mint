import { isPathInGroup } from '@/utils/paths/isPathInGroup';

describe('isPathInGroup', () => {
  test('returns true when is a page', () => {
    expect(
      isPathInGroup('/my-page', {
        group: 'Group',
        pages: [{ href: '/other' }, { href: '/my-page' }],
      })
    ).toEqual(true);
  });

  test('returns true when nested inside a subgroup', () => {
    expect(
      isPathInGroup('/my-page', {
        group: 'Group',
        pages: [{ group: 'Nested Group', pages: [{ href: '/other' }, { href: '/my-page' }] }],
      })
    ).toEqual(true);
  });

  test('returns false when not in the group', () => {
    expect(isPathInGroup('/my-page', { group: 'Group', pages: [{ href: '/other' }] })).toEqual(
      false
    );
  });
});

import { getFirstPageStartingWith } from '@/utils/staticProps/getFirstPageStartingWith';

describe('getFirstPageStartingWith', () => {
  test('finds first page in navigation array', () => {
    expect(
      getFirstPageStartingWith(
        [
          {
            group: 'Group Name',
            pages: [{ href: '/link/to/page' }, { href: '/starting/with/link' }],
          },
        ],
        '/starting/with'
      )
    ).toEqual({ href: '/starting/with/link' });
  });

  test('can return exact matches', () => {
    expect(
      getFirstPageStartingWith(
        [
          {
            group: 'Group Name',
            pages: [{ href: '/link/to/page' }, { href: '/second/link' }],
          },
        ],
        '/link/to/page'
      )
    ).toEqual({ href: '/link/to/page' });
  });

  test('returns empty object when there is no match', () => {
    expect(
      getFirstPageStartingWith(
        [
          {
            group: 'Group Name',
            pages: [{ href: '/not/starting/with' }],
          },
        ],
        '/starting/with'
      )
    ).toEqual({});
  });
});

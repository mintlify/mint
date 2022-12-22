import { getFirstPage } from '@/utils/staticProps/getFirstPage';

describe('getFirstPage', () => {
  test('finds first page in navigation array', () => {
    expect(
      getFirstPage([
        {
          group: 'Group Name',
          pages: [{ href: '/link/to/page' }, { href: '/second/link' }],
        },
      ])
    ).toEqual({ href: '/link/to/page' });
  });

  test('returns empty object when there is no match', () => {
    expect(
      getFirstPage([
        {
          group: 'Group Name',
          pages: [],
        },
      ])
    ).toEqual({});
  });
});

import { pathToBreadcrumbs } from '@/utils/pathToBreadcrumbs';

describe('pathToBreadcrumbs', () => {
  test('gets breadcrumbs recursively', () => {
    const breadcrumbs = pathToBreadcrumbs('my/page', {
      name: 'site-name',
      navigation: [
        {
          group: 'Bread 1',
          pages: ['not/my/page', { group: 'Bread 2', pages: ['my/page'] }],
        },
      ],
    });
    expect(breadcrumbs).toEqual(['Bread 1', 'Bread 2']);
  });

  test('returns an empty array when there is no match', () => {
    const breadcrumbs = pathToBreadcrumbs('missing/page', {
      name: 'site-name',
      navigation: [
        {
          group: 'Bread 1',
          pages: ['not/my/page', { group: 'Bread 2', pages: ['my/page'] }],
        },
      ],
    });
    expect(breadcrumbs).toEqual([]);
  });
});

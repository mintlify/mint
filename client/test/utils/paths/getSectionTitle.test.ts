import { getSectionTitle } from '@/utils/paths/getSectionTitle';

describe('getSectionTitle', () => {
  test('gets title of top-level parent', () => {
    expect(getSectionTitle('/page/page', [{ group: 'Group', pages: ['page/page'] }])).toEqual(
      'Group'
    );
  });

  test('gets title of nested parent', () => {
    expect(
      getSectionTitle('/page/page', [
        { group: 'Group', pages: [{ group: 'Nested Group', pages: ['page/page'] }] },
      ])
    ).toEqual('Nested Group');
  });

  test('returns empty string when there is no match', () => {
    expect(getSectionTitle('/', [{ group: 'Group', pages: ['page/page'] }])).toEqual('');
  });
});

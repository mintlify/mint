import { getAllMetaTags } from '@/utils/getAllMetaTags';

describe('getAllMetaTags', () => {
  test('gets tags from file before reading config and includes default values', () => {
    expect(
      getAllMetaTags(
        { 'og:title': 'My Title' },
        {
          'og:title': 'Config Title',
          'og:site_name': 'Config Site Name',
        }
      )
    ).toEqual({
      'og:title': 'My Title',
      'og:site_name': 'Config Site Name',
      'og:type': 'website',
      'twitter:title': '', // Default title when title is not set in page meta and name is not set in config
      charset: 'utf-8',
    });
  });

  test('generates default title from site name', () => {
    expect(
      getAllMetaTags(
        { title: 'My Title' },
        {
          name: 'Site Name',
        }
      )
    ).toEqual({
      'og:title': 'My Title - Site Name',
      'twitter:title': 'My Title - Site Name',
      'og:type': 'website',
      charset: 'utf-8',
    });
  });
});

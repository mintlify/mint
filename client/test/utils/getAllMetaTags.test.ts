import { getAllMetaTags } from '@/utils/getAllMetaTags';

describe('getAllMetaTags', () => {
  test('gets tags from file before reading config and includes default values', () => {
    expect(
      getAllMetaTags(
        { 'og:title': 'My Title' },
        {
          name: 'Site Name',
          metadata: { 'og:title': 'Config Title', 'og:site_name': 'Meta Site Name' },
        }
      )
    ).toEqual({
      'og:title': 'My Title',
      'og:site_name': 'Meta Site Name',
      'og:description': undefined,
      'og:type': 'website',
      'twitter:title': 'Site Name', // Default title when "title" is undefined in the page metadata
      charset: 'utf-8',
    });
  });

  test('generates default title from site name', () => {
    expect(
      getAllMetaTags(
        { title: 'My Title', description: 'Description' },
        {
          name: 'Site Name',
          metadata: {},
        }
      )
    ).toEqual({
      'og:title': 'My Title - Site Name',
      description: 'Description',
      'og:description': 'Description',
      'og:site_name': 'Site Name',
      'twitter:title': 'My Title - Site Name',
      'og:type': 'website',
      charset: 'utf-8',
    });
  });
});

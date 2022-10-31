import { pathToVersionDict } from '@/utils/pathToVersionDict';

describe('pathToVersionDict', () => {
  const configNoAnchors = {
    name: 'site-name',
    navigation: [
      {
        group: 'group-name',
        version: 'v1',
        pages: ['path/to/page'],
      },
    ],
  };

  test('gets page version from group', () => {
    const output = pathToVersionDict(
      [
        {
          group: 'group-name',
          version: 'v1',
          pages: [{ href: 'path/to/page' }],
        },
      ],
      configNoAnchors
    );
    expect(output).toEqual({ 'path/to/page': 'v1' });
  });

  test('page metadata overrides group version', () => {
    const output = pathToVersionDict(
      [
        {
          group: 'group-name',
          version: 'v1',
          pages: [{ href: 'path/to/page', version: 'v2' }],
        },
      ],
      configNoAnchors
    );
    expect(output).toEqual({ 'path/to/page': 'v2' });
  });

  test('gets page version from anchor', () => {
    const output = pathToVersionDict(
      [
        {
          group: 'group-name',
          version: 'v1',
          pages: [{ href: 'path/to/page' }],
        },
        {
          group: 'other-group-name',
          pages: [{ href: 'anchor-path/to/page' }],
        },
      ],
      {
        name: 'site-name',
        navigation: [
          {
            group: 'group-name',
            version: 'v1',
            pages: ['path/to/page'],
          },
          {
            group: 'other-group-name',
            pages: ['anchor-path/to/page'],
          },
        ],
        anchors: [
          {
            name: 'anchor-name',
            version: 'v3',
            url: 'anchor-path',
          },
        ],
      }
    );
    expect(output).toEqual({ 'path/to/page': 'v1', 'anchor-path/to/page': 'v3' });
  });
});

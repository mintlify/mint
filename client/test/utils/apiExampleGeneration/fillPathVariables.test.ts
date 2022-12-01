import { fillPathVariables } from '@/utils/apiExampleGeneration/fillPathVariables';

describe('fillPathVariables', () => {
  test('replaces path variables using curly bracket syntax', () => {
    expect(
      fillPathVariables(
        'https://mysite.org/api/{pathVariable}/{other-variable}',
        [
          {
            name: 'pathVariable',
          },
          {
            name: 'other-variable',
          },
        ],
        {
          pathVariable: '123',
          'other-variable': 'example',
        }
      )
    ).toEqual('https://mysite.org/api/123/example');
  });
});

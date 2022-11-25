import { bodyParamsToObjectString } from '@/utils/apiExampleGeneration/bodyParamToObjectString';

describe('bodyParamsToObjectString', () => {
  test('does not generate brackets when params are missing', () => {
    expect(bodyParamsToObjectString([])).toEqual('');
    expect(bodyParamsToObjectString(undefined)).toEqual('');
  });

  test('handles string values', () => {
    expect(bodyParamsToObjectString([{ name: 'name' }])).toEqual('{\n "name": "VALUE"\n}');
    expect(bodyParamsToObjectString([{ name: 'name' }, { name: 'secondName' }])).toEqual(
      '{\n "name": "VALUE",\n "secondName": "VALUE"\n}'
    );
  });
});

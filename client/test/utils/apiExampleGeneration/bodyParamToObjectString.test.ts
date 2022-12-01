import { bodyParamsToObjectString } from '@/utils/apiExampleGeneration/bodyParamToObjectString';

describe('bodyParamsToObjectString', () => {
  test('does not generate brackets when params are missing', () => {
    expect(bodyParamsToObjectString([], {}, 1)).toEqual('');
    expect(bodyParamsToObjectString(undefined, {}, 1)).toEqual('');
  });

  test('handles string values', () => {
    expect(bodyParamsToObjectString([{ name: 'name', type: 'number' }], {}, 1)).toEqual(
      '{\n "name": number\n}'
    );
    expect(
      bodyParamsToObjectString(
        [
          { name: 'name', type: 'number' },
          { name: 'secondName', type: 'string' },
        ],
        {},
        1
      )
    ).toEqual('{\n "name": number,\n "secondName": "string"\n}');
  });

  test('handles string values even when parameter type is missing', () => {
    expect(bodyParamsToObjectString([{ name: 'name' }], {}, 1)).toEqual('{\n "name": VALUE\n}');
  });

  test('fills in user inputs', () => {
    expect(
      bodyParamsToObjectString(
        [{ name: 'name', type: 'number' }, { name: 'stringButNoParameterType' }],
        {
          name: 12,
          stringButNoParameterType: '123',
        },
        1
      )
    ).toEqual('{\n "name": 12,\n "stringButNoParameterType": 123\n}');
    expect(
      bodyParamsToObjectString(
        [
          { name: 'name', type: 'number' },
          { name: 'secondName', type: 'string' },
        ],
        {
          name: 12,
          secondName: 'example',
        },
        1
      )
    ).toEqual('{\n "name": 12,\n "secondName": "example"\n}');
  });

  test('fills in arrays', () => {
    expect(
      bodyParamsToObjectString(
        [{ name: 'name', type: 'array' }],
        {
          name: [1, '2'],
        },
        1
      )
    ).toEqual('{\n "name": [1,"2"]\n}');
  });

  test('fills in objects', () => {
    expect(
      bodyParamsToObjectString(
        [
          {
            name: 'name',
            type: 'object',
            properties: [
              { name: 'firstNested', type: 'array' },
              { name: 'secondNested', type: 'string' },
            ],
          },
        ],
        {
          name: {
            firstNested: [1, '2'],
            secondNested: 'textString',
          },
        },
        1
      )
    ).toEqual('{\n "name": {\n  "firstNested": [1,"2"],\n  "secondNested": "textString"\n }\n}');
  });
});

import { getAuthParamName } from '@/utils/apiExampleGeneration/getAuthParamName';

describe('getAuthParamName', () => {
  test('capitalizes method when missing name', () => {
    expect(getAuthParamName(undefined, 'key')).toEqual('Key');
    expect(getAuthParamName('', 'bearer')).toEqual('Bearer');
  });
});

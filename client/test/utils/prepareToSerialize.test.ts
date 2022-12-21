import { prepareToSerialize } from '@/utils/prepareToSerialize';

describe('prepareToSerialize', () => {
  test('gets tags from file before reading config and includes default values', () => {
    expect(
      prepareToSerialize({
        'Key 1': 'Value',
        'Key 2': '',
        'Key 3': null,
        'Key 4': undefined,
        'Key 5': ['Value Array', { 'Nested Key 1': NaN, 'Nested Key 2': 'Nested Value' }],
      })
    ).toEqual({
      'Key 1': 'Value',
      'Key 2': '',
      'Key 3': null,
      'Key 5': ['Value Array', { 'Nested Key 1': null, 'Nested Key 2': 'Nested Value' }],
    });
  });
});

import { Param } from '@mintlify/components';

export function bodyParamsToObjectString(bodyParams?: Param[]) {
  if (!bodyParams?.length) {
    return '';
  }

  return (
    '{\n' +
    bodyParams
      .map((param, i) => ` "${param.name}": "VALUE"${i + 1 !== bodyParams.length ? ',' : ''}`)
      .join('\n') +
    '\n}'
  );
}

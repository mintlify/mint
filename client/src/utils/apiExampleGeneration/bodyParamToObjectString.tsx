import { Param } from '../api';

export function bodyParamsToObjectString(
  bodyParams: Param[] | undefined,
  bodyInputs: Record<string, any> | undefined,

  /** Must be equal to or greater than one. */
  indentation: number
) {
  if (!bodyParams?.length) {
    return '';
  }

  const indentationStr = ' '.repeat(indentation);

  return (
    '{\n' +
    bodyParams
      .map((param, i) => {
        const input = bodyInputs?.[param.name] ?? param.type ?? 'VALUE';
        const toDisplay = displayableInput(param, input, indentation);

        // Add a comma to all except the last value
        return `${indentationStr}"${param.name}": ${toDisplay}${
          i + 1 !== bodyParams.length ? ',' : ''
        }`;
      })
      .join('\n') +
    `\n${' '.repeat(indentation - 1)}}`
  );
}

function displayableInput(param: Param, input: any, indentation: number) {
  // NaN !== NaN is always true, so we use this to check if input is set to NaN.
  // We cannot use isNaN because that checks if input is not a number, not if it
  // is set to the value NaN.
  // We have to check for it specifically because ?? doesn't match NaN.
  // eslint-disable-next-line no-self-compare
  if (input !== input) {
    input = param.type;
  }

  if (param.type === 'string') {
    input = `"${input}"`;
  } else if (param.type === 'array') {
    input = JSON.stringify(input);
  } else if (param.properties != null) {
    // Parameters with properties are objects
    input = bodyParamsToObjectString(param.properties, input, indentation + 1);
    input.replace(/ "/g, '  "');
  }

  return input;
}

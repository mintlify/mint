import { Param } from '../api';

export function fillPathVariables(
  endpoint: string,
  pathParams: Param[] | undefined,
  pathInputs: Record<string, any> | undefined
) {
  if (pathParams == null || pathInputs == null) {
    return endpoint;
  }

  for (const param of pathParams) {
    // We self-compare to make sure input is not NaN
    if (
      param.name &&
      pathInputs[param.name] != null &&
      pathInputs[param.name] !== '' &&
      // eslint-disable-next-line no-self-compare
      pathInputs[param.name] === pathInputs[param.name]
    ) {
      const regex = new RegExp('{' + param.name + '}', 'g');
      endpoint = endpoint.replace(regex, pathInputs[param.name]);
    }
  }

  return endpoint;
}

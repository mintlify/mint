type UnionError = {
  message: string;
  code?: string;
  unionErrors?: UnionError[];
};

// TO DO: Write unit tests for this function.
// TO DO: Prettify the output instead of just returning JSON objects.
export function flattenUnionErrorMessages(unionErrors: UnionError[]) {
  return unionErrors.reduce((acc, unionError): string[] => {
    if (
      Array.isArray(unionError.unionErrors) &&
      unionError.unionErrors.length > 0
    ) {
      return [...acc, ...flattenUnionErrorMessages(unionError.unionErrors)];
    }
    return [...acc, unionError.message];
  }, [] as string[]);
}

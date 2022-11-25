export const getParameterType = (schema: any) => {
  if (schema.type === 'string' && schema.format === 'binary') {
    return 'file';
  }
  return schema.type;
};

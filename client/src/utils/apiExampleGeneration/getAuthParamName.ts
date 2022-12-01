export function getAuthParamName(authName: string | undefined, authMethod: string | undefined) {
  if (authName) {
    return authName;
  }

  if (authMethod === 'bearer') {
    return 'Bearer';
  } else if (authMethod === 'key') {
    return 'Key';
  }

  return '';
}

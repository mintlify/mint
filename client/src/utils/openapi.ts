import { Component } from '@/enums/components';

export const createParamField = (attributes: Record<string, any>) => {
  const attributesArray = Object.entries(attributes).map(([key, value]) => {
    return {
      type: 'mdx',
      name: key,
      value,
    };
  });
  return {
    type: Component.ParamField,
    attributes: attributesArray,
  };
};

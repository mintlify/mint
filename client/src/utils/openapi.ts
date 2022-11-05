import { Component } from '@/enums/components';

export const createParamField = (attributes: Record<string, any>, children?: any) => {
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
    children,
  };
};

export const createExpandable = (children: any) => {
  return {
    name: Component.Expandable,
    children,
  };
};

export const getProperties = (properties: any[]): any[] => {
  return Object.entries(properties).map(([property, propertyValue]: any) => {
    let children;
    if (propertyValue.properties) {
      const nestedProperties = getProperties(propertyValue.properties);
      children = [createExpandable(nestedProperties)];
    }
    return createParamField(
      {
        body: property,
        ...propertyValue,
      },
      children
    );
  });
};

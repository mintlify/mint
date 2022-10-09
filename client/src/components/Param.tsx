import { Param as GenericParam } from '@mintlify/components';

export type ParamProps = {
  query?: string;
  path?: string;
  body?: string;
  children: any;
  default?: string;
  type?: string;
  required?: boolean;
  hidden?: boolean;

  // Used to flow data to the API Playground
  last?: boolean;
  placeholder?: any;
  enum?: string[];
};

// 9/8/2022 - Migrate everyone off Param
export function Param(props: ParamProps) {
  return <ParamField {...props} />;
}

// Also props: query, body, path
export function ParamField({
  query,
  path,
  body,
  children,
  default: defaultValue,
  type,
  required = false,
  hidden = false,
  last,
  placeholder,
  enum: enumValues,
}: ParamProps) {
  if (!query && !path && !body) {
    return null;
  }

  const name = query || path || body;

  return (
    <GenericParam
      name={name!}
      defaultValue={defaultValue}
      type={type}
      required={required}
      hidden={hidden}
      nameClasses="text-primary dark:text-primary-light"
    >
      {children}
    </GenericParam>
  );
}

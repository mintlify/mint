import { Param as GenericParam } from '@mintlify/components';
import { ReactNode } from 'react';

// The API playground detects all Params to generate the playground fields,
// so this cannot be replaced by the Param component even if the UI is the same.
export function ResponseField({
  name,
  type,
  hidden,
  default: defaultValue,
  required,
  children,
}: {
  name: string;
  type: string;
  hidden?: boolean;
  default?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <GenericParam
      name={name}
      type={type}
      hidden={hidden}
      defaultValue={defaultValue}
      required={required}
      nameClasses="text-primary dark:text-primary-light"
    >
      {children}
    </GenericParam>
  );
}

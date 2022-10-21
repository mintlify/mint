import { createContext, ReactNode, useState } from 'react';

export type VersionInterface = {
  versionOptions: string[];
  selectedVersion: string;
  setSelectedVersion: any;
};

export const VersionContext = createContext({
  versionOptions: [],
  selectedVersion: '',
  setSelectedVersion: () => {},
} as VersionInterface);

export function VersionContextController({
  versionOptions,
  children,
}: {
  versionOptions?: string[];
  children: ReactNode;
}) {
  const defaultVersion =
    Array.isArray(versionOptions) && versionOptions.length > 0 ? versionOptions[0] : '';
  const [selectedVersion, setSelectedVersion] = useState<string>(defaultVersion);

  return (
    <VersionContext.Provider
      value={{ versionOptions: versionOptions || [], setSelectedVersion, selectedVersion }}
    >
      {children}
    </VersionContext.Provider>
  );
}

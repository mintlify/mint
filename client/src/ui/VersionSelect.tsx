import { PillSelect } from '@mintlify/components';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

import { ConfigContext } from '@/context/ConfigContext';
import { VersionContext } from '@/context/VersionContext';
import { getVersionOfPage } from '@/utils/nav';

export function VersionSelect() {
  const { config } = useContext(ConfigContext);
  const versions = config?.versions?.filter(Boolean) || [];
  const { selectedVersion, setSelectedVersion } = useContext(VersionContext);
  const router = useRouter();

  // Only run when the page loads. Otherwise, users could never change the API version
  // because the page would keep changing it back to its own version.
  useEffect(() => {
    const version = getVersionOfPage(config?.navigation ?? [], router.pathname.substring(1));
    if (version) {
      setSelectedVersion(version);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // It's possible to show a selected version that doesn't exist in versionOptions, for example by navigating to
  // a secret v3 page when the menu only shows v1 and v2. Thus, we only hide the dropdown when nothing is selected.
  if (!selectedVersion) {
    return null;
  }

  const onVersionChange = (version: string) => {
    setSelectedVersion(version);
  };

  return (
    <PillSelect
      options={versions}
      onChange={onVersionChange}
      defaultOption={selectedVersion}
      selectedOptionClass="text-primary dark:text-primary-light"
    />
  );
}

import { PillSelect } from '@mintlify/components';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

import { ConfigContext } from '@/context/ConfigContext';
import { VersionContext } from '@/context/VersionContext';
import { useCurrentPath } from '@/hooks/useCurrentPath';
import { getVersionOfPage } from '@/utils/nav';

export function VersionSelect() {
  const { mintConfig } = useContext(ConfigContext);
  const versions = mintConfig?.versions?.filter(Boolean) || [];
  const { selectedVersion, setSelectedVersion } = useContext(VersionContext);
  const router = useRouter();
  const path = useCurrentPath();

  // Only run when the page loads. Otherwise, users could never change the API version
  // because the page would keep changing it back to its own version.
  useEffect(() => {
    const version = getVersionOfPage(mintConfig?.navigation ?? [], mintConfig?.anchors ?? [], path);
    if (version) {
      setSelectedVersion(version);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSelectedVersion]);

  // It's possible to show a selected version that doesn't exist in versionOptions, for example by navigating to
  // a secret v3 page when the menu only shows v1 and v2. Thus, we only hide the dropdown when nothing is selected.
  if (!selectedVersion) {
    return null;
  }

  const onVersionChange = (version: string) => {
    setSelectedVersion(version);
    router.push('/');
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

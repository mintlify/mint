import { Expandable as GenericExpandable } from '@mintlify/components';
import { ReactNode, useContext } from 'react';

import AnalyticsContext from '@/analytics/AnalyticsContext';

export function Expandable({
  title,
  defaultOpen = false,
  onChange: onChangeProp,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  onChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  const analyticsMediator = useContext(AnalyticsContext);
  const openAnalyticsListener = analyticsMediator.createEventListener('expandable_open');
  const closeAnalyticsListener = analyticsMediator.createEventListener('expandable_close');

  const onChange = (open: boolean) => {
    if (onChangeProp) {
      onChangeProp(open);
    }

    if (open) {
      openAnalyticsListener({ title });
    } else {
      closeAnalyticsListener({ title });
    }
  };

  return (
    <GenericExpandable title={title} onChange={onChange} defaultOpen={defaultOpen}>
      {children}
    </GenericExpandable>
  );
}

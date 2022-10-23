import { Accordion as GenericAccordion } from '@mintlify/components';
import { ReactNode, useContext } from 'react';

import AnalyticsContext from '@/analytics/AnalyticsContext';

function Accordion({
  title,
  description,
  defaultOpen = false,
  icon,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen: boolean;
  icon?: ReactNode | string;
  children: ReactNode;
}) {
  const analyticsMediator = useContext(AnalyticsContext);
  const openAnalyticsListener = analyticsMediator.createEventListener('accordion_open');
  const closeAnalyticsListener = analyticsMediator.createEventListener('accordion_close');

  const onChange = (open: boolean) => {
    if (open) {
      openAnalyticsListener({ title });
    } else {
      closeAnalyticsListener({ title });
    }
  };

  return (
    <GenericAccordion
      title={title}
      description={description}
      defaultOpen={defaultOpen}
      onChange={onChange}
      icon={icon}
    >
      {children}
    </GenericAccordion>
  );
}

export default Accordion;

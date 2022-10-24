import { Accordion as GenericAccordion } from '@mintlify/components';
import { ReactNode, useContext } from 'react';

import AnalyticsContext from '@/analytics/AnalyticsContext';
import { ComponentIcon } from '@/ui/Icon';

function Accordion({
  title,
  description,
  defaultOpen = false,
  icon,
  iconType,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen: boolean;
  icon?: ReactNode | string;
  iconType?: string;
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

  const Icon =
    typeof icon === 'string' ? (
      <ComponentIcon icon={icon} iconType={iconType as any} className="w-4 h-4" />
    ) : (
      icon
    );

  return (
    <GenericAccordion
      title={title}
      description={description}
      defaultOpen={defaultOpen}
      onChange={onChange}
      icon={Icon}
    >
      {children}
    </GenericAccordion>
  );
}

export default Accordion;

import type { ReactElement, ReactNode } from 'react';
import { Tooltip as CarbonTooltip } from '@carbon/react';

type TooltipProps = {
  align?: 'top' | 'right' | 'bottom' | 'left';
  children: ReactNode;
  icon: ReactElement;
};

export function Tooltip({ align = 'bottom', children, icon }: TooltipProps) {
  return (
    <CarbonTooltip align={align} label={children}>
      {icon}
    </CarbonTooltip>
  );
}

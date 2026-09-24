import {
  Time,
  Archive,
  Close,
  Activity,
  SubtractAlt,
  Email,
  Pending,
  ConnectionSignal,
  InProgress,
  CheckmarkFilled,
} from '@carbon/icons-react';
import { Tag } from '@carbon/react';
import type { TYPES } from '@carbon/react/es/components/Tag/Tag';
import type { ElementType } from 'react';

type IndicatorSize = 'small' | 'medium' | 'large';
type CarbonTagType = keyof typeof TYPES;

interface StatusIndicatorProps {
  state: string;
  size?: IndicatorSize;
}

type StatusConfig = {
  type: CarbonTagType;
  Icon: ElementType;
  display: string;
};

export const StatusIndicator = ({
  state,
  size = 'medium',
}: StatusIndicatorProps) => {
  const complete: StatusConfig = {
    type: 'purple',
    Icon: CheckmarkFilled,
    display: 'Complete',
  };
  const statusConfig: Record<string, StatusConfig> = {
    INVITED: {
      type: 'cyan',
      Icon: Email,
      display: 'Invited',
    },
    WAITLIST: {
      type: 'warm-gray',
      Icon: Time,
      display: 'Waitlist',
    },

    ACTIVE: {
      type: 'green',
      Icon: Activity,
      display: 'Active',
    },
    IN_PROGRESS: {
      type: 'blue',
      Icon: InProgress,
      display: 'In progress',
    },
    SUCCESS: {
      type: 'green',
      Icon: CheckmarkFilled,
      display: 'Success',
    },
    COMPLETE: complete,
    COMPLETED: complete,
    'STREAM-STOPPED': complete,
    INACTIVE: {
      type: 'gray',
      Icon: SubtractAlt,
      display: 'Inactive',
    },
    ARCHIEVE: {
      type: 'warm-gray',
      Icon: Archive,
      display: 'Archive',
    },
    QUEUED: {
      type: 'cyan',
      Icon: Pending,
      display: 'Queued',
    },
    CONNECTED: {
      type: 'teal',
      Icon: ConnectionSignal,
      display: 'Connected',
    },
    FAILED: {
      type: 'red',
      Icon: Close,
      display: 'Failed',
    },
  };

  const config = statusConfig[state.toUpperCase()] || statusConfig.INACTIVE;

  const sizeClasses: Record<IndicatorSize, 'sm' | 'md'> = {
    small: 'sm',
    medium: 'md',
    large: 'md',
  };

  return (
    <Tag
      size={sizeClasses[size]}
      type={config.type}
      renderIcon={config.Icon}
      className="!whitespace-nowrap"
    >
      {config.display}
    </Tag>
  );
};

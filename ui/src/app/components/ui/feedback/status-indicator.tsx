import type { ComponentType } from 'react';
import { preview__ShapeIndicator as ShapeIndicatorModule } from '@carbon/react';
import { CarbonIconIndicator } from './icon-indicator';

export type CarbonStatusIndicatorKind =
  | 'failed'
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'cautious'
  | 'undefined'
  | 'stable'
  | 'informative'
  | 'incomplete'
  | 'draft';

const statusMap: Record<
  string,
  { kind: CarbonStatusIndicatorKind; label: string }
> = {
  // Success / complete: stable (green)
  SUCCESS: { kind: 'stable', label: 'Success' },
  success: { kind: 'stable', label: 'Success' },
  COMPLETE: { kind: 'stable', label: 'Complete' },
  complete: { kind: 'stable', label: 'Complete' },
  COMPLETED: { kind: 'stable', label: 'Completed' },
  completed: { kind: 'stable', label: 'Completed' },
  'STREAM-STOPPED': { kind: 'stable', label: 'Complete' },
  CONNECTED: { kind: 'stable', label: 'Connected' },
  Connected: { kind: 'stable', label: 'Connected' },
  DEPLOYED: { kind: 'stable', label: 'Deployed' },
  deployed: { kind: 'stable', label: 'Deployed' },

  // Active / in progress: informative (blue)
  ACTIVE: { kind: 'incomplete', label: 'Active' },
  active: { kind: 'incomplete', label: 'Active' },
  IN_PROGRESS: { kind: 'informative', label: 'In Progress' },
  in_progress: { kind: 'informative', label: 'In Progress' },

  // Pending / waiting: cautious (yellow)
  PENDING: { kind: 'cautious', label: 'Pending' },
  pending: { kind: 'cautious', label: 'Pending' },
  INVITED: { kind: 'cautious', label: 'Invited' },
  invited: { kind: 'cautious', label: 'Invited' },
  WAITLIST: { kind: 'low', label: 'Waitlist' },
  waitlist: { kind: 'low', label: 'Waitlist' },

  // Queued: medium (orange)
  QUEUED: { kind: 'medium', label: 'Queued' },
  queued: { kind: 'medium', label: 'Queued' },

  // Inactive / not started: incomplete (gray dashed)
  INACTIVE: { kind: 'incomplete', label: 'Inactive' },
  inactive: { kind: 'incomplete', label: 'Inactive' },
  DISABLED: { kind: 'incomplete', label: 'Disabled' },
  disabled: { kind: 'incomplete', label: 'Disabled' },

  // Archived: draft (gray half)
  ARCHIEVE: { kind: 'draft', label: 'Archived' },
  archived: { kind: 'draft', label: 'Archived' },

  // Failed: failed (red X)
  FAILED: { kind: 'failed', label: 'Failed' },
  failed: { kind: 'failed', label: 'Failed' },

  // Error: critical (red diamond)
  ERROR: { kind: 'critical', label: 'Error' },
  error: { kind: 'critical', label: 'Error' },

  // Interrupted: high (orange)
  INTERRUPTED: { kind: 'high', label: 'Interrupted' },
  interrupted: { kind: 'high', label: 'Interrupted' },
};

export const defaultStatus = {
  kind: 'undefined' as CarbonStatusIndicatorKind,
  label: 'Unknown',
};

type ShapeIndicatorComponent = ComponentType<{
  kind: CarbonStatusIndicatorKind;
  label: string;
  textSize?: 12 | 14;
}>;

const ShapeIndicator =
  (ShapeIndicatorModule as unknown as { default?: ShapeIndicatorComponent })
    ?.default || (ShapeIndicatorModule as unknown as ShapeIndicatorComponent);

export const statusToShapeIndicator = (
  state: string,
): { kind: CarbonStatusIndicatorKind; label: string } =>
  statusMap[state] || defaultStatus;

export interface CarbonStatusIndicatorProps {
  state: string;
  textSize?: 12 | 14;
}

export function CarbonStatusIndicator({
  state,
  textSize = 12,
}: CarbonStatusIndicatorProps) {
  if (state === 'IN_PROGRESS') {
    return (
      <CarbonIconIndicator
        align="right"
        iconDescription="Icon"
        kind="in-progress"
        label="In progress"
        size={16}
      />
    );
  }

  if (state === 'RINGING') {
    return (
      <CarbonIconIndicator
        align="right"
        iconDescription="Icon"
        kind="pending"
        label="Ringing"
        size={16}
      />
    );
  }

  const { kind, label } = statusToShapeIndicator(state);

  return <ShapeIndicator kind={kind} label={label} textSize={textSize} />;
}

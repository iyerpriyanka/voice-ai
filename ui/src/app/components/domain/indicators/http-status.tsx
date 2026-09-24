import type { ComponentType } from 'react';
import { unstable__ShapeIndicator as ShapeIndicatorModule } from '@carbon/react';

const ShapeIndicator =
  (
    ShapeIndicatorModule as unknown as {
      default?: ComponentType<ShapeIndicatorProps>;
    }
  ).default ||
  (ShapeIndicatorModule as unknown as ComponentType<ShapeIndicatorProps>);

type ShapeIndicatorKind =
  | 'stable'
  | 'informative'
  | 'cautious'
  | 'failed'
  | 'undefined';

interface ShapeIndicatorProps {
  kind: ShapeIndicatorKind;
  label: string;
  textSize: 12 | 14;
}

const getStatusKind = (
  status: number,
): { kind: ShapeIndicatorKind; label: string } => {
  if (status >= 200 && status < 300)
    return { kind: 'stable', label: `${status} OK` };
  if (status >= 300 && status < 400)
    return { kind: 'informative', label: `${status} Redirect` };
  if (status >= 400 && status < 500)
    return { kind: 'cautious', label: `${status} Client Error` };
  if (status >= 500) return { kind: 'failed', label: `${status} Server Error` };
  return { kind: 'undefined', label: `${status}` };
};

export function HttpStatusSpanIndicator({
  status,
  textSize = 12,
}: {
  status: number;
  textSize?: 12 | 14;
}) {
  const { kind, label } = getStatusKind(status);
  return <ShapeIndicator kind={kind} label={label} textSize={textSize} />;
}

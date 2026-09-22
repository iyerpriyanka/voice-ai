import { Tag } from '@carbon/react';
import type { TYPES } from '@carbon/react/es/components/Tag/Tag';
import { Edit, UserAdmin, UserRole, View } from '@carbon/icons-react';
import type { ElementType } from 'react';

type IndicatorSize = 'small' | 'medium' | 'large';
type CarbonTagType = keyof typeof TYPES;

interface RoleIndicatorProps {
  role?: string;
  size?: IndicatorSize;
}

type RoleConfig = {
  type: CarbonTagType;
  display: string;
  Icon: ElementType;
};

export const RoleIndicator = ({
  role,
  size = 'medium',
}: RoleIndicatorProps) => {
  const roleConfig: Record<string, RoleConfig> = {
    'super admin': {
      type: 'purple',
      display: 'Super Admin',
      Icon: UserAdmin,
    },
    SUPER_ADMIN: {
      type: 'purple',
      display: 'Super Admin',
      Icon: UserAdmin,
    },
    'SUPER ADMIN': {
      type: 'purple',
      display: 'Super Admin',
      Icon: UserAdmin,
    },
    admin: {
      type: 'blue',
      display: 'Admin',
      Icon: UserRole,
    },
    ADMIN: {
      type: 'blue',
      display: 'Admin',
      Icon: UserRole,
    },
    writer: {
      type: 'green',
      display: 'Writer',
      Icon: Edit,
    },
    WRITER: {
      type: 'green',
      display: 'Writer',
      Icon: Edit,
    },
    reader: {
      type: 'cyan',
      display: 'Reader',
      Icon: View,
    },
    READER: {
      type: 'cyan',
      display: 'Reader',
      Icon: View,
    },
    DEFAULT: {
      type: 'gray',
      display: 'User',
      Icon: UserRole,
    },
  };
  const config = role
    ? roleConfig[role] || roleConfig.DEFAULT
    : roleConfig.DEFAULT;
  const Icon = config.Icon;

  const sizeClasses: Record<IndicatorSize, 'sm' | 'md'> = {
    small: 'sm',
    medium: 'md',
    large: 'md',
  };

  return (
    <Tag
      size={sizeClasses[size]}
      type={config.type}
      renderIcon={Icon}
      className="!whitespace-nowrap"
    >
      {config.display}
    </Tag>
  );
};

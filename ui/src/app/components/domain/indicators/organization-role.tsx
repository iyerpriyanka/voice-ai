import { Tag } from '@carbon/react';
import type { TYPES } from '@carbon/react/es/components/Tag/Tag';
import { UserAdmin, UserMultiple, UserRole } from '@carbon/icons-react';
import type { ElementType } from 'react';

type IndicatorSize = 'small' | 'medium' | 'large';
type CarbonTagType = keyof typeof TYPES;

interface OrganizationRoleIndicatorProps {
  role?: string;
  size?: IndicatorSize;
}

type RoleConfig = {
  type: CarbonTagType;
  display: string;
  Icon: ElementType;
};

export const OrganizationRoleIndicator = ({
  role,
  size = 'medium',
}: OrganizationRoleIndicatorProps) => {
  const roleConfig: Record<string, RoleConfig> = {
    owner: {
      type: 'red',
      display: 'Owner',
      Icon: UserAdmin,
    },
    OWNER: {
      type: 'red',
      display: 'Owner',
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
    member: {
      type: 'green',
      display: 'Member',
      Icon: UserMultiple,
    },
    MEMBER: {
      type: 'green',
      display: 'Member',
      Icon: UserMultiple,
    },
    DEFAULT: {
      type: 'gray',
      display: 'Member',
      Icon: UserMultiple,
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

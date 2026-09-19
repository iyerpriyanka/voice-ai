import React from 'react';
import { Tag } from '@carbon/react';
import { Edit, UserAdmin, UserRole, View } from '@carbon/icons-react';

export const RoleIndicator = ({ role, size = 'medium' }) => {
  const roleConfig = {
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
    ? roleConfig[role] || roleConfig['DEFAULT']
    : roleConfig['DEFAULT'];
  const Icon = config.Icon;

  const sizeClasses = {
    small: 'sm',
    medium: 'md',
    large: 'md',
  };

  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <Tag
      size={sizeClass}
      type={config.type}
      renderIcon={Icon}
      className="!whitespace-nowrap"
    >
      {config.display}
    </Tag>
  );
};

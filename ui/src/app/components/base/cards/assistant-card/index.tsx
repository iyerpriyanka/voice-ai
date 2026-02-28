import { AssistantIcon } from '@/app/components/Icon/Assistant';
import { FC } from 'react';

import {
  CardDescription,
  CardTag,
  CardTitle,
  ClickableCard,
} from '@/app/components/base/cards';
import { cn } from '@/utils';

interface AssistantCardProps {
  deployment: {
    name: string;
    description: string;
    id: string;
    tags: string[];
    status: string;
    icon?: string;
  };
}

export const AssistantCard: FC<AssistantCardProps> = ({ deployment }) => {
  return (
    <ClickableCard
      to={`/deployment/assistant/view/${deployment.id}`}
      className={cn(
        'relative min-h-full p-4 md:p-5 rounded-2xl border! shadow-none',
      )}
    >
      <div className="border border-gray-300/10 bg-gray-600/10 rounded-[2px] flex items-center justify-center shrink-0 h-10 w-10 p-1 mr-3">
        {deployment.icon ? (
          <div>
            <img
              className="w-full h-full object-cover rounded-[2px]"
              alt="Assistant Icon"
              src={deployment.icon}
            />
          </div>
        ) : (
          <AssistantIcon
            className="w-6 h-6 text-violet-600"
            strokeWidth={1.5}
          />
        )}
      </div>

      <CardTitle
        className="text-lg font-medium mt-4 opacity-80"
        title={deployment.name}
      />
      <CardDescription
        className="mt-1 opacity-70 text-base"
        description={deployment.description}
      />
      <div className="flex justify-end space-x-1.5 mt-6">
        <CardTag tags={deployment.tags} />
      </div>
    </ClickableCard>
  );
};

export const AssisstantIcon: FC<{ icon?: string }> = ({ icon }) => {
  return (
    <div className="border border-gray-300/10 bg-gray-600/10 rounded-[2px] flex items-center justify-center shrink-0 h-10 w-10 p-1 mr-3">
      {icon ? (
        <img
          className="w-full h-full object-cover rounded-[2px]"
          alt="Assistant Icon"
          src={icon}
        />
      ) : (
        <AssistantIcon className="w-6 h-6 text-violet-600" strokeWidth={1.5} />
      )}
    </div>
  );
};

import { TextImage } from '@/app/components/ui/primitives';

interface ProjectUserGroupAvatarProps {
  size?: 7 | 8 | 9;
  members: { name: string }[];
  label?: string;
}

export function ProjectUserGroupAvatar({
  size,
  members,
  label = 'Project members',
}: ProjectUserGroupAvatarProps) {
  return (
    <ul
      aria-label={label}
      className="flex flex-wrap justify-center sm:justify-start mb-8 sm:mb-0 -space-x-2 -ml-px"
    >
      {members.map((member, index) => (
        <li key={`${member.name}-${index}`} aria-label={member.name}>
          <div className="block rounded-[2px] border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
            <TextImage size={size} name={member.name} />
          </div>
        </li>
      ))}
    </ul>
  );
}

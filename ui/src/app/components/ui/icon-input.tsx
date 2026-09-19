import { cn } from '@/utils';
import { IconOnlyButton } from '@/app/components/ui/button';
import { Input, type InputProps } from '@/app/components/ui/input';
import { Search } from '@carbon/icons-react';
import { forwardRef, type ComponentProps, useId } from 'react';

interface IconInputProps extends InputProps {
  wrapperClassName?: string;
  iconClassName?: string;
  placeholder?: string;
}

export const SearchIconInput = forwardRef<HTMLInputElement, IconInputProps>(
  (props: IconInputProps, ref) => {
    const generatedId = useId().replace(/:/g, '');
    const {
      wrapperClassName,
      className,
      iconClassName,
      id,
      name,
      placeholder,
      ...atr
    } = props;
    const inputId = id ?? `search-input-${generatedId}`;
    const SearchIcon = ({
      className,
      ...iconProps
    }: ComponentProps<typeof Search>) => (
      <Search {...iconProps} className={cn(className, iconClassName)} />
    );

    return (
      <div
        className={cn(
          'relative w-160 max-w-full h-10 flex items-center',
          wrapperClassName,
        )}
      >
        <Input
          {...atr}
          id={inputId}
          labelText="Search"
          name={name ?? 'search-input'}
          ref={ref}
          className={cn('w-full [&_.cds--text-input]:!pl-9', className)}
          type="search"
          placeholder={placeholder ?? 'Find resources..'}
        />
        <IconOnlyButton
          className="absolute inset-y-0 left-0 !h-full !min-h-0 !w-9 !p-0"
          type="submit"
          kind="ghost"
          size="sm"
          iconDescription="Search"
          renderIcon={SearchIcon}
        />
      </div>
    );
  },
);

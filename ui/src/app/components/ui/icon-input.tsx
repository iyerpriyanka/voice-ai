import { cn } from '@/utils';
import { IconOnlyButton } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Search } from '@carbon/icons-react';
import {
  forwardRef,
  type ComponentProps,
  type InputHTMLAttributes,
  useId,
} from 'react';

interface IconInputProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  iconClassName?: string;
  placeholder?: string;
}

export const SearchIconInput = forwardRef<HTMLInputElement, IconInputProps>(
  (props: IconInputProps, ref) => {
    const generatedId = useId();
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
    const SearchIcon = ({ className, ...iconProps }: ComponentProps<
      typeof Search
    >) => (
      <Search {...iconProps} className={cn(className, iconClassName)} />
    );

    return (
      <div
        className={cn(
          'relative w-160 max-w-full h-10 flex items-center',
          wrapperClassName,
        )}
      >
        <label htmlFor={inputId} className="sr-only">
          Search
        </label>
        <Input
          {...atr}
          id={inputId}
          name={name ?? 'search-input'}
          ref={ref}
          className={cn('w-full py-2 pl-9!', className)}
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

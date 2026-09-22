import { cn } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from '@carbon/icons-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { useState } from 'react';

interface InputGroupProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  initiallyExpanded?: boolean;
  childClass?: string;
}
export function InputGroup({
  initiallyExpanded = true,
  childClass,
  children,
  className,
  title,
  ...props
}: InputGroupProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  return (
    <section
      {...props}
      className={cn('border-b border-gray-200 dark:border-gray-800', className)}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'h-12 px-4 flex items-center justify-between w-full cursor-pointer',
          'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
          isExpanded && 'border-b border-gray-200 dark:border-gray-800',
        )}
      >
        <div className="flex-none text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </div>
        <ChevronDown
          size={16}
          className={cn(
            'text-gray-500 transition-transform duration-200',
            isExpanded && 'rotate-180',
          )}
        />
      </div>
      <AnimatePresence>
        <motion.div
          className={cn('px-6 py-6', childClass)}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          style={{ display: isExpanded ? 'block' : 'none' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

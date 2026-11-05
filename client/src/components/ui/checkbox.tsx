import type { ComponentProps } from 'react';
import { cn } from 'cn';

function Checkbox({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        'size-4 shrink-0 cursor-pointer accent-primary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:outline-2 aria-invalid:outline-destructive',
        className,
      )}
      {...props}
    />
  );
}

export { Checkbox };

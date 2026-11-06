import type { ComponentProps } from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  secondary?: boolean;
  multiline?: boolean;
  maxLength?: number;
} & Pick<ComponentProps<'input'>, 'type' | 'inputMode' | 'autoComplete' | 'placeholder'>;

export function TextField({ id, label, value, onChange, error, hint, secondary, multiline, maxLength, ...rest }: TextFieldProps) {
  const hintId = `${id}-hint`;
  const counterId = `${id}-counter`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, maxLength && counterId, error && errorId].filter(Boolean).join(' ') || undefined;
  const fieldProps = {
    id,
    value,
    placeholder: rest.placeholder,
    maxLength,
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
    onChange: (event: { target: { value: string } }) => onChange(event.target.value),
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className={secondary ? 'font-normal text-muted-foreground' : undefined}>
        {label}
      </Label>
      {hint && (
        <p id={hintId} className="text-small text-muted-foreground">
          {hint}
        </p>
      )}
      {multiline ? (
        <Textarea {...fieldProps} rows={6} className="bg-card dark:bg-card" />
      ) : (
        <Input {...fieldProps} {...rest} className="h-11 bg-card dark:bg-card" />
      )}
      {maxLength && (
        <p id={counterId} className="self-end text-small text-muted-foreground">
          {value.length} / {maxLength}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-body text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

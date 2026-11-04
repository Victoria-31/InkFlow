import type { ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  multiline?: boolean;
} & Pick<ComponentProps<'input'>, 'type' | 'inputMode' | 'autoComplete'>;

// Label, hint and error message linked to the field for screen readers
export function TextField({ id, label, value, onChange, error, hint, multiline = false, ...inputProps }: TextFieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;
  // Filled fields, as in the Figma kit
  const fieldProps = {
    id,
    value,
    className: 'bg-card dark:bg-card',
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {hint && (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {multiline ? (
        <Textarea {...fieldProps} rows={6} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <Input
          {...fieldProps}
          {...inputProps}
          className="h-11 bg-card dark:bg-card"
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

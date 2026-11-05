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
  // Sub-label inside a group (fieldset): lighter than the group legend
  secondary?: boolean;
  multiline?: boolean;
  // Shows a character counter under the field
  maxLength?: number;
} & Pick<ComponentProps<'input'>, 'type' | 'inputMode' | 'autoComplete' | 'placeholder'>;

const count = new Intl.NumberFormat('fr-FR');

// Label, hint, counter and error message linked to the field for screen readers
export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  secondary = false,
  multiline = false,
  maxLength,
  ...inputProps
}: TextFieldProps) {
  const hintId = `${id}-hint`;
  const counterId = `${id}-counter`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, maxLength && counterId, error && errorId].filter(Boolean).join(' ') || undefined;
  // Filled fields, as in the Figma kit
  const fieldProps = {
    id,
    value,
    placeholder: inputProps.placeholder,
    // Native limit: typing or pasting stops at maxLength (the API still checks it)
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
        <Input {...fieldProps} {...inputProps} className="h-11 bg-card dark:bg-card" />
      )}
      {/* Read with the field (aria-describedby) rather than announced at each keystroke */}
      {maxLength && (
        <p id={counterId} className="self-end text-small text-muted-foreground">
          {count.format(value.length)} / {count.format(maxLength)}
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

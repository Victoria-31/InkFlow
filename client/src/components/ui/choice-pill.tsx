import { Check } from 'lucide-react';

type ChoicePillProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
  invalid?: boolean;
};

export function ChoicePill({ label, checked, onChange, invalid = false }: ChoicePillProps) {
  return (
    <label className="cursor-pointer">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} aria-invalid={invalid} />
      <span className="inline-flex items-center gap-2 rounded-full border border-input bg-card px-3 py-1 text-body transition-colors peer-checked:border-primary-light peer-checked:bg-primary/15 peer-focus-visible:ring-3 peer-focus-visible:ring-ring hover:border-muted-foreground">
        {checked && <Check aria-hidden="true" className="size-4 text-primary-light" />}
        {label}
      </span>
    </label>
  );
}

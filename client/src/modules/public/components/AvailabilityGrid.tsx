import { useTranslation } from 'react-i18next';
import { AVAILABILITIES, type Availability } from '@inkflow/shared';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

type AvailabilityGridProps = {
  workingSlots: Availability[];
  value: Availability[];
  onToggle: (slot: Availability) => void;
  invalid: boolean;
};

// One group per working day, with only the half-days the artist works
export function AvailabilityGrid({ workingSlots, value, onToggle, invalid }: AvailabilityGridProps) {
  const { t } = useTranslation();
  const slotsOf = (day: string) => AVAILABILITIES.filter((slot) => slot.startsWith(day) && workingSlots.includes(slot));
  const workingDays = DAYS.filter((day) => slotsOf(day).length > 0);

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {workingDays.map((day) => (
        <li key={day}>
          <fieldset className="flex flex-col gap-2 rounded-lg border p-3">
            <legend className="px-1 text-sm font-medium">{t(`days.${day}`)}</legend>
            {slotsOf(day).map((slot) => (
              <Label key={slot} className="font-normal">
                <Checkbox checked={value.includes(slot)} onCheckedChange={() => onToggle(slot)} aria-invalid={invalid} />
                {t(`halfDays.${slot.split('_')[1]}`)}
              </Label>
            ))}
          </fieldset>
        </li>
      ))}
    </ul>
  );
}

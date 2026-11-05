import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AVAILABILITIES, type Availability } from '@inkflow/shared';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const HALF_DAYS = ['AM', 'PM'];

type AvailabilityGridProps = {
  workingSlots: Availability[];
  selectedSlots: Availability[];
  onToggle: (slot: Availability) => void;
  invalid: boolean;
};

// Calendar-like table: one column per working day, one row per half-day.
// Half-days when the studio is closed are shown but cannot be chosen.
export function AvailabilityGrid({ workingSlots, selectedSlots, onToggle, invalid }: AvailabilityGridProps) {
  const { t } = useTranslation();
  const isWorkingDay = (day: string) => workingSlots.some((slot) => slot.startsWith(day));
  const workingDays = DAYS.filter(isWorkingDay);

  return (
    <table className="w-full table-fixed border-separate border-spacing-2">
      <thead>
        <tr>
          <td />
          {workingDays.map((day) => (
            <th key={day} scope="col" className="text-small font-medium text-muted-foreground uppercase">
              {t(`daysShort.${day}`)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {HALF_DAYS.map((half) => (
          <tr key={half}>
            <th scope="row" className="text-left text-body font-medium first-letter:uppercase">
              {t(`halfDays.${half}`)}
            </th>
            {workingDays.map((day) => {
              const slot = `${day}_${half}` as Availability;
              const label = `${t(`days.${day}`)} ${t(`halfDays.${half}`)}`;
              if (!workingSlots.includes(slot) || !AVAILABILITIES.includes(slot)) {
                return (
                  <td key={slot} className="text-center text-muted-foreground">
                    <span aria-hidden="true">·</span>
                    <span className="sr-only">{`${label} : ${t('request.project.closed')}`}</span>
                  </td>
                );
              }
              const checked = selectedSlots.includes(slot);
              return (
                <td key={slot}>
                  <label className="block cursor-pointer">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={checked}
                      onChange={() => onToggle(slot)}
                      aria-invalid={invalid}
                    />
                    <span className="flex h-11 items-center justify-center rounded-md border border-input bg-card transition-colors peer-checked:border-primary-light peer-checked:bg-primary/15 peer-focus-visible:ring-3 peer-focus-visible:ring-ring hover:border-muted-foreground">
                      {checked && <Check aria-hidden="true" className="size-4 text-primary-light" />}
                    </span>
                    <span className="sr-only">{label}</span>
                  </label>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

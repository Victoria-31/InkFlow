import type { TFunction } from 'i18next';
import type { Availability } from '@inkflow/shared';

type Budget = { budgetMin?: number | null; budgetMax?: number | null };

// Shared by the request form (review step) and the artist's request screens
export function formatBudget(t: TFunction, language: string, { budgetMin, budgetMax }: Budget) {
  const euros = new Intl.NumberFormat(language, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const hasMin = budgetMin !== undefined && budgetMin !== null;
  const hasMax = budgetMax !== undefined && budgetMax !== null;

  if (hasMin && hasMax) return `${euros.format(budgetMin)} – ${euros.format(budgetMax)}`;
  if (hasMin) return t('budget.from', { amount: euros.format(budgetMin) });
  if (hasMax) return t('budget.upTo', { amount: euros.format(budgetMax) });
  return t('budget.none');
}

// "TUE_PM" → "Mardi après-midi"
export function formatSlot(t: TFunction, slot: Availability) {
  const [day, half] = slot.split('_');
  return `${t(`days.${day}`)} ${t(`halfDays.${half}`)}`;
}

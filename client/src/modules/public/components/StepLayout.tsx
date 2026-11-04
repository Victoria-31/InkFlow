import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusOnMount } from '@/hooks/useFocusOnMount';
import { STEPS } from '../project-request-form';

type StepLayoutProps = {
  stepIndex: number;
  title: string;
  intro: string;
  aside?: ReactNode;
  children: ReactNode;
};

// Title on the left, form on the right (stacked on mobile), with the progress bar
export function StepLayout({ stepIndex, title, intro, aside, children }: StepLayoutProps) {
  const { t } = useTranslation();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-16">
      <div className="flex flex-col gap-3 lg:pt-12">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          {t('request.step', { current: stepIndex + 1, total: STEPS.length })}
        </p>
        <h1 ref={headingRef} tabIndex={-1} className="font-serif text-4xl outline-none sm:text-5xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{intro}</p>
        {aside}
      </div>
      <div className="flex flex-col gap-6">
        <div aria-hidden="true" className="grid grid-cols-3 gap-2">
          {STEPS.map((step, index) => (
            <span key={step} className={`h-0.5 rounded-full ${index <= stepIndex ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

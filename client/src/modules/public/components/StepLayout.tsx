import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNewScreen } from '@/hooks/useNewScreen';
import { STEPS } from '../project-request-form';
import type { PublicArtist } from '@inkflow/shared';
import { ArtistReminder } from './ArtistReminder';
import { KoiIllustration } from './KoiIllustration';

type StepLayoutProps = {
  artist: PublicArtist;
  stepIndex: number;
  title: string;
  intro?: string;
  aside?: ReactNode;
  children: ReactNode;
};

// Title on the left, form on the right (stacked on mobile), with the progress bar
export function StepLayout({ artist, stepIndex, title, intro, aside, children }: StepLayoutProps) {
  const { t } = useTranslation();
  const headingRef = useNewScreen<HTMLHeadingElement>();

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-16">
      <div className="relative isolate flex flex-col">
        <div className="hidden lg:block lg:flex-1" />
        {/* Stays visible while the form scrolls, then stops at the end of its column */}
        <div className="flex flex-col gap-3 lg:sticky lg:top-8">
          <p className="eyebrow">{t('request.step', { current: stepIndex + 1, total: STEPS.length })}</p>
          <h1 ref={headingRef} tabIndex={-1} className="page-title outline-none">
            {title}
          </h1>
          {intro && <p className="text-body text-muted-foreground">{intro}</p>}
          {aside}
          <ArtistReminder artist={artist} />
        </div>
        <div className="hidden lg:block lg:flex-[3]" />
        <KoiIllustration />
      </div>
      <div className="flex flex-col gap-6">
        <div aria-hidden="true" className="grid grid-cols-3 gap-2">
          {STEPS.map((step, index) => (
            <span key={step} className={`h-0.5 rounded-full ${index <= stepIndex ? 'bg-primary-light' : 'bg-border'}`} />
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

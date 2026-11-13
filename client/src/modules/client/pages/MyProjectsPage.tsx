import { useTranslation } from 'react-i18next';
import { useNewScreen } from '@/hooks/useNewScreen';

// Landing page of the client space; its content comes with the client stories (IN-32, IN-54)
export function MyProjectsPage() {
  const { t } = useTranslation();
  const headingRef = useNewScreen<HTMLHeadingElement>();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-16">
      <h1 ref={headingRef} tabIndex={-1} className="page-title outline-none">
        {t('myProjects.title')}
      </h1>
    </main>
  );
}

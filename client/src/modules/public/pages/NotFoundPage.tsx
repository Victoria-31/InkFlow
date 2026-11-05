import { useTranslation } from 'react-i18next';
import { KoiIllustration } from '../components/KoiIllustration';
import { PublicFooter } from '../components/PublicFooter';

// "artist": the public link points to no studio; "page": any other unknown address
export function NotFoundPage({ kind = 'page' }: { kind?: 'page' | 'artist' }) {
  const { t } = useTranslation();

  return (
    <div className="isolate flex min-h-svh flex-col">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-16">
        <h1 className="page-title">{t(`notFound.${kind}Title`)}</h1>
        <p className="text-body text-muted-foreground">{t(`notFound.${kind}Text`)}</p>
      </main>
      <PublicFooter />
      <KoiIllustration />
    </div>
  );
}

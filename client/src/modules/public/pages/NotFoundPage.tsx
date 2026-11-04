import { useTranslation } from 'react-i18next';

// "artist": the public link points to no studio; "page": any other unknown address
export function NotFoundPage({ kind = 'page' }: { kind?: 'page' | 'artist' }) {
  const { t } = useTranslation();

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-16">
      <h1 className="font-serif text-5xl">{t(`notFound.${kind}Title`)}</h1>
      <p className="text-muted-foreground">{t(`notFound.${kind}Text`)}</p>
    </main>
  );
}

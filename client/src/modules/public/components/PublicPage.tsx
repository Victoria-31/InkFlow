import type { ReactNode } from 'react';
import type { PublicArtist } from '@inkflow/shared';
import { PublicFooter } from './PublicFooter';
import { PublicHeader } from './PublicHeader';

export function PublicPage({ artist, children }: { artist: PublicArtist; children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <PublicHeader artist={artist} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 sm:px-8">{children}</main>
      <PublicFooter />
    </div>
  );
}

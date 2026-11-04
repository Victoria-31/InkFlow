import type { ReactNode } from 'react';
import type { PublicArtist } from '@inkflow/shared';
import { EnsoDecoration } from './EnsoDecoration';
import { PublicHeader } from './PublicHeader';

export function PublicPage({ artist, children }: { artist: PublicArtist; children: ReactNode }) {
  return (
    <>
      <PublicHeader artist={artist} />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-8">{children}</main>
      <EnsoDecoration />
    </>
  );
}

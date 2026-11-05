import type { PublicArtist } from '@inkflow/shared';

// Reminds the prospect who they are writing to
export function ArtistSummaryCard({ artist }: { artist: PublicArtist }) {
  return (
    <div className="mt-8 hidden items-center gap-4 rounded-xl bg-card/60 p-4 lg:flex">
      {artist.portrait && <img src={artist.portrait} alt="" className="size-14 rounded-full object-cover" />}
      <div>
        <p className="text-body font-semibold">
          {artist.firstName} {artist.lastName}
        </p>
        <p className="text-small text-muted-foreground">
          {[artist.city, ...artist.specialties.map((tag) => tag.name)].filter(Boolean).join(' · ')}
        </p>
      </div>
    </div>
  );
}

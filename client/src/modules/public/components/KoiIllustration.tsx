import koi from '@/assets/koi.svg';

// Brand watermark: the koi drawing used as a mask and filled with the primary colour, very transparent.
// Purely decorative; smaller on mobile so it stays in the corner.
export function KoiIllustration() {
  return (
    <div
      className="pointer-events-none fixed -bottom-16 -left-16 -z-10 size-80 bg-primary opacity-10 lg:-bottom-24 lg:-left-24 lg:size-[32rem]"
      style={{ maskImage: `url(${koi})`, maskSize: 'contain', maskRepeat: 'no-repeat' }}
    />
  );
}

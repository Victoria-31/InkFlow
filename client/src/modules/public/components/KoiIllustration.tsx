import koi from '@/assets/koi.svg';

// Brand watermark: the koi drawing used as a mask and filled with the primary colour, very transparent.
// Purely decorative and desktop only.
export function KoiIllustration() {
  return (
    <div
      className="pointer-events-none fixed -bottom-24 -left-24 -z-10 hidden size-[32rem] bg-primary opacity-10 lg:block"
      style={{ maskImage: `url(${koi})`, maskSize: 'contain', maskRepeat: 'no-repeat' }}
    />
  );
}

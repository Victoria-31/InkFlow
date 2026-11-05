import type { ReactNode } from 'react';

// Information box with the indigo left border of the kit
export function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-r-lg border-l-2 border-primary-light bg-primary/10 px-4 py-3">
      <p className="text-body font-semibold">{title}</p>
      <p className="text-body text-muted-foreground">{children}</p>
    </div>
  );
}

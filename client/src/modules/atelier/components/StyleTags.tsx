import type { Tag } from '@inkflow/shared';

export function StyleTags({ styles }: { styles: Tag[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {styles.map((style) => (
        <li key={style.id} className="rounded-full border bg-muted px-3 py-1 text-small">
          {style.name}
        </li>
      ))}
    </ul>
  );
}

/**
 * Single source of truth for section ordering and numbering.
 * Reorder entries here — eyebrows everywhere update automatically.
 * App.tsx maps over this to render sections in order.
 */
export const SECTIONS = [
  { id: 'hero', label: 'IDENTITY' },
  { id: 'whoami', label: 'WHOAMI' },
  // { id: 'stack',      label: 'CAPABILITY MAP' },
  { id: 'arch', label: 'ARCHITECTURE' },
  // { id: 'lab',        label: 'SYSTEMS LAB'    },
  // { id: 'work',       label: 'CASE STUDIES'   },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'cicd', label: 'CI/CD FEED' },
] as const satisfies readonly { id: string; label: string }[];

export type SectionId = (typeof SECTIONS)[number]['id'];

export function sectionNum(id: SectionId): string {
  const idx = SECTIONS.findIndex((s) => s.id === id);
  return String(idx + 1).padStart(2, '0');
}

export function sectionEyebrow(id: SectionId): string {
  const idx = SECTIONS.findIndex((s) => s.id === id);
  const { label } = SECTIONS[idx];
  return `${String(idx + 1).padStart(2, '0')} / ${label}`;
}

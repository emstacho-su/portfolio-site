// Single source of truth for contact addresses (Evan, 2026-08-13): the
// marquee ribbon and the Contact dialog both render from this list, so the
// two can never drift apart. Labels are display text; hrefs are the explicit
// link targets the dialog surfaces.
export interface ContactItem {
  label: string;
  href: string;
  // Drives the dialog's icon + caption per row.
  kind: 'email' | 'github' | 'linkedin' | 'phone';
}

export const CONTACT_ITEMS: readonly ContactItem[] = [
  {
    label: 'emstacho@syr.edu',
    href: 'mailto:emstacho@syr.edu',
    kind: 'email',
  },
  {
    label: 'github.com/emstacho-su',
    href: 'https://github.com/emstacho-su',
    kind: 'github',
  },
  {
    label: 'linkedin.com/in/evan-stachowiak',
    href: 'https://www.linkedin.com/in/evan-stachowiak-449119349',
    kind: 'linkedin',
  },
  {
    label: '(262) 933-0228',
    href: 'tel:+12629330228',
    kind: 'phone',
  },
] as const;

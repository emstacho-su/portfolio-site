// Copyright-only footer (Evan, 2026-08-12): the contact addresses live in
// the ContactRibbon marquee (visible) and its sr-only list (accessible), so
// everything else here was redundant. The id stays so the Contact nav link,
// scrollspy, and section_view analytics keep resolving to the page bottom.
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-hairline scroll-mt-12">
      <div className="max-w-[1200px] mx-auto px-6 py-5">
        <p className="font-mono text-xs text-tertiary">
          © {year} Evan Stachowiak
        </p>
      </div>
    </footer>
  );
}

// sessionStorage can throw (Safari private-mode quirks, storage disabled by
// policy, sandboxed webviews). A throw inside a boot-path effect would leave
// the HeroLoader overlay mounted and Lenis stopped — a permanently frozen,
// blank page — so every boot-path read/write goes through these wrappers and
// treats storage as best-effort.
export function safeSessionGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSessionSet(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Losing the "already played" flag only means an intro can replay on the
    // next visit; failing boot is never acceptable.
  }
}

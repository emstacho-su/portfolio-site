import '@testing-library/jest-dom/vitest';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// jsdom does not implement IntersectionObserver. The new scroll-driven hooks
// (use-scrollspy, use-section-view, use-in-view-video) and the demo-section
// component all build observers, so tests must be able to construct one and
// drive its callback manually. This stub stores the callback on the instance so
// a test can call `observer.callback(entries, observer)` to simulate
// intersection changes; observe/unobserve/disconnect/takeRecords are no-ops.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  // Exposed so tests can drive entries: io.callback([entry], io).
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    if (options?.root && options.root instanceof Element) {
      (this.root as Element | Document | null) = options.root;
    }
    if (options?.rootMargin) {
      (this.rootMargin as string) = options.rootMargin;
    }
    if (options?.threshold != null) {
      (this.thresholds as ReadonlyArray<number>) = Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold];
    }
  }

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverStub,
});
Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverStub,
});

// jsdom omits HTMLMediaElement play/pause. The in-view video hook calls
// `.play().catch(...)`, so play must return a resolved Promise and pause must
// be a no-op or the demo-section / reduced-motion tests throw "not implemented".
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  configurable: true,
  value: function play(): Promise<void> {
    return Promise.resolve();
  },
});
Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  configurable: true,
  value: function pause(): void {},
});

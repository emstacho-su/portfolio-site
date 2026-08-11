import { describe, it, expect } from 'vitest';
import { projects } from '@/data/projects';

/**
 * R-25 / R-26 (Wave 2): The new Project data model and the featured set.
 *
 * `@/data/projects` already exists, so the import resolves. This file is
 * INTENTIONALLY RED until Wave 2 rewrites `src/data/projects.ts` to the target
 * shape in REDESIGN-SPEC §4.3 (id/slug/title/hook/overview/tech/status/links/
 * heroImage + ordered demos[]) and replaces the old featured set
 * (GTO Poker / Algo Trading / SchoolworkTrack) with the new one. Failures here
 * are assertion failures against the not-yet-written model, NOT import errors.
 */
const REQUIRED_FIELDS = [
  'id',
  'slug',
  'title',
  'hook',
  'overview',
  'summary',
  'period',
  'tech',
  'status',
  'links',
  'heroImage',
  'demos',
  'resumeBullets',
] as const;

// Brief §4 display set (bulkDocReformat deliberately left off per Evan).
const FEATURED_TITLES = ['StyleStack', 'Quant Edge Tracker', 'AI News Agent'];

describe('projects data model (R-26, D-15)', () => {
  it('has at least one project', () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  it('every project carries all required fields', () => {
    for (const project of projects) {
      for (const field of REQUIRED_FIELDS) {
        expect(
          project as unknown as Record<string, unknown>,
          `project ${(project as { id?: string }).id ?? '<unknown>'} missing ${field}`
        ).toHaveProperty(field);
      }
    }
  });

  it('every project status is shipped or in-progress', () => {
    for (const project of projects) {
      expect(['shipped', 'in-progress']).toContain(
        (project as { status?: string }).status
      );
    }
  });

  it('every project has an ordered demos[] whose entries have a valid type', () => {
    for (const project of projects) {
      const demos = (project as { demos?: unknown }).demos;
      expect(Array.isArray(demos), `project ${(project as { id?: string }).id} demos is not an array`).toBe(true);
      // An EMPTY demos[] is a legitimate awaiting-media state (brief §8.3):
      // the pop-out then renders the summary paragraphs plus an explicit
      // "media in production" empty state, and dev builds warn about the gap.
      for (const demo of demos as Array<Record<string, unknown>>) {
        expect(['video', 'image']).toContain(demo.type);
        expect(typeof demo.caption).toBe('string');
        expect(typeof demo.body).toBe('string');
        expect(typeof demo.src).toBe('string');
      }
    }
  });

  it('projects awaiting media still give the pop-out real content (summary)', () => {
    for (const project of projects) {
      const { summary, demos } = project as unknown as {
        summary: string[];
        demos: unknown[];
      };
      if (demos.length === 0) {
        expect(summary.length).toBeGreaterThan(0);
      }
    }
  });

  it('every project has a links object', () => {
    for (const project of projects) {
      const links = (project as { links?: unknown }).links;
      expect(typeof links).toBe('object');
      expect(links).not.toBeNull();
    }
  });
});

describe('featured project set (R-25, D-14)', () => {
  it('is exactly Quant Edge Tracker, AI News Agent', () => {
    const titles = projects.map((p) => (p as { title?: string }).title);
    expect(titles.sort()).toEqual([...FEATURED_TITLES].sort());
  });

  it('retires the prior set (GTO Poker / Algo Trading / SchoolworkTrack)', () => {
    const retired = ['GTO Poker Trainer', 'Algorithmic Futures Trading System', 'SchoolworkTrack', 'bulkDocReformat'];
    const titles = projects.map((p) => (p as { title?: string }).title);
    for (const old of retired) {
      expect(titles, `retired project ${old} is still present`).not.toContain(old);
    }
  });
});

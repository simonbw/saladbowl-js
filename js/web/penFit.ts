'use strict';

/**
 * @file "Same pen, smaller writing": fit player-written text (in Cause, a
 * variable font) into a box. When text has to shrink to fit, its weight goes
 * up so the stroke stays the same thickness, as if the same pen just wrote
 * smaller.
 */

export const HAND_FONT = 'Cause';

// Cause's stem width ('l' at half x-height) as a fraction of the em, per weight,
// measured from the font files. It's close to linear in weight.
const STEMS: [weight: number, stem: number][] = [
  [100, 0.0197], [200, 0.0347], [300, 0.0504], [400, 0.0654], [500, 0.0842],
  [600, 0.1034], [700, 0.1219], [800, 0.1411], [900, 0.1598],
];

function stemAt(weight: number): number {
  for (let i = 1; i < STEMS.length; i++) {
    const [w1, s1] = STEMS[i];
    if (weight <= w1) {
      const [w0, s0] = STEMS[i - 1];
      return s0 + (s1 - s0) * (weight - w0) / (w1 - w0);
    }
  }
  return STEMS[STEMS.length - 1][1];
}

function weightFor(stem: number): number {
  for (let i = 1; i < STEMS.length; i++) {
    const [w1, s1] = STEMS[i];
    if (stem <= s1) {
      const [w0, s0] = STEMS[i - 1];
      return w0 + (w1 - w0) * (stem - s0) / (s1 - s0);
    }
  }
  return STEMS[STEMS.length - 1][0];
}

/**
 * The weight at `size` that draws the same stroke as `base` weight at `maxSize`.
 * Clamped to the font's range, so below a point the pen can't keep up.
 */
export function penWeight(size: number, maxSize: number, base = 400): number {
  const weight = weightFor(stemAt(base) * maxSize / size);
  return Math.round(Math.min(900, Math.max(100, weight)));
}

export interface FitOptions {
  max: number; // px, the size short text is written at
  min: number; // px, never smaller than this; long words break instead
  base?: number; // weight at `max`
}

export interface Fit {
  size: number;
  weight: number;
  breakWords: boolean; // nothing fit even at `min`, so words have to break
}

let canvas: CanvasRenderingContext2D | null = null;
function textWidth(text: string, size: number, weight: number): number {
  canvas ??= document.createElement('canvas').getContext('2d');
  if (!canvas) {
    return text.length * size * 0.5;
  }
  canvas.font = `${weight} ${size}px ${HAND_FONT}`;
  return canvas.measureText(text).width;
}

/** Largest size in [min, max] for which `fits` is true (assumed monotonic). */
function largest(min: number, max: number, fits: (size: number) => boolean): number | null {
  if (fits(max)) {
    return max;
  }
  if (!fits(min)) {
    return null;
  }
  let lo = min, hi = max; // fits(lo), !fits(hi)
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (fits(mid)) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return lo;
}

/**
 * Fit wrapping text into a box: the largest size where no word is wider than
 * the box and the wrapped text isn't taller than it. `el` is the element
 * holding the text; it is measured in place (and left styled with the result).
 */
export function fitBlock(el: HTMLElement, width: number, height: number, opts: FitOptions): Fit {
  const base = opts.base ?? 400;
  const words = (el.textContent ?? '').split(/\s+/).filter(Boolean);
  const apply = (size: number, breakWords: boolean) => {
    const weight = penWeight(size, opts.max, base);
    el.style.fontSize = size + 'px';
    el.style.fontWeight = String(weight);
    el.style.overflowWrap = breakWords ? 'anywhere' : '';
    return weight;
  };
  const size = largest(opts.min, opts.max, (s) => {
    const weight = apply(s, false);
    return words.every((word) => textWidth(word, s, weight) <= width) && el.offsetHeight <= height;
  });
  if (size == null) {
    return { size: opts.min, weight: apply(opts.min, true), breakWords: true };
  }
  return { size, weight: apply(size, false), breakWords: false };
}

/** Fit a single line (an input's value) into `width`. */
export function fitLine(text: string, width: number, opts: FitOptions): Fit {
  const base = opts.base ?? 400;
  const size = largest(opts.min, opts.max, (s) => textWidth(text, s, penWeight(s, opts.max, base)) <= width);
  const final = size ?? opts.min;
  return { size: final, weight: penWeight(final, opts.max, base), breakWords: size == null };
}

let handFontReady: Promise<unknown> | null = null;
/**
 * Resolves once the hand font has loaded. Measuring before then measures the
 * fallback font. Asking for it explicitly also starts the download early,
 * before any text on the page uses it.
 */
export function whenHandFontReady(): Promise<unknown> {
  handFontReady ??= document.fonts
    ? document.fonts.load(`400 20px ${HAND_FONT}`).catch(() => undefined)
    : Promise.resolve();
  return handFontReady;
}

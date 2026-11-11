'use strict';

/**
 * @file The SaladBowl wordmark: "SaladBo?l" in Rubik 600, with the w replaced
 * by a bowl holding three slips. The bowl is drawn as solid shapes with thin
 * gaps where lines would be, and its geometry comes from Rubik's own w (arm
 * angle, arm width, where the arm tops sit) so it sits in the word like a
 * letter.
 *
 * Shared by the React app and, through a Vite HTML transform, the static pages,
 * so it is plain markup with no DOM or React dependency.
 */

// Rubik 600's w, in em/100 units with the baseline at y=100 (measured from the font file).
const W = {
  xHeight: 52,
  advance: 82.9,
  left: 2.8, // ink extent
  right: 80,
  angle: 16.1, // outer arms, degrees from vertical
  arm: 11.87, // arm thickness
  topLeft: 9.63, // centre of each arm's top
  topRight: 73.2,
  topMid: 41.45,
};

const GAP = 4.5; // gap width around the bowl, in the wordmark

const f = (n: number) => n.toFixed(2);

/**
 * The bowl and its three slips, in paint order. Each shape is meant to be
 * filled with the ink and stroked with the background, so the strokes read as
 * gaps. `gap` is the stroke (gap) width.
 */
function bowlShapes(gap: number): string {
  const slipGap = gap * 0.85;
  const k = W.xHeight / 48.9;
  const rim = 100 - W.xHeight * 0.57;
  const rimDip = 4.5 * k;
  const bottom = 100 + 5.5 * k; // dips a little below the baseline
  const mid = (W.left + W.right) / 2;
  const rx = (W.right - W.left) / 2;
  const depth = bottom - rim;
  const top = 100 - W.xHeight - slipGap / 2;
  const pivotY = rim + 6; // slips are tucked into the bowl, shortened so they never poke out the sides
  const width = W.arm + slipGap;

  const slip = (topX: number, deg: number) => {
    const t = (deg * Math.PI) / 180;
    const length = (pivotY - top) / Math.cos(t);
    const baseX = topX - length * Math.sin(t);
    return `<rect x="${f(baseX - width / 2)}" y="${f(pivotY - length)}" width="${f(width)}" height="${f(length + 3)}" rx="0.6" transform="rotate(${f(deg)} ${f(baseX)} ${f(pivotY)})" stroke-width="${f(slipGap)}"/>`;
  };
  const bowl = `<path d="M${W.left} ${f(rim)}A${f(rx)} ${f(rimDip)} 0 0 0 ${W.right} ${f(rim)}`
    + `C${W.right} ${f(rim + depth * 0.62)} ${f(mid + rx * 0.62)} ${f(bottom)} ${f(mid)} ${f(bottom)}`
    + `S${W.left} ${f(rim + depth * 0.62)} ${W.left} ${f(rim)}Z" stroke-width="${f(gap)}" stroke-linejoin="round"/>`;
  return slip(W.topLeft, -W.angle) + slip(W.topRight, W.angle) + slip(W.topMid, 0) + bowl;
}

function glyph(): string {
  return `<svg class="logo-bowl" viewBox="0 0 ${W.advance} 100" width="${(W.advance / 100).toFixed(3)}em" height="1em" aria-hidden="true">`
    + `<g fill="currentColor" style="stroke:var(--logo-gap,#fff)">${bowlShapes(GAP)}</g></svg>`;
}

/**
 * The bowl on its own, as a standalone SVG for the favicon. The gaps are wider
 * than in the wordmark so they survive at 16px, and they're cut out (masked)
 * rather than painted, so the icon works on light and dark tab bars. It
 * switches to a light ink in dark mode. The PNG icons in public/images are
 * rendered from this.
 */
export function faviconSvg(options: { background?: string; padding?: number } = {}): string {
  const gap = 7;
  const size = 84 + 2 * (options.padding ?? 0);
  const x = 41.4 - size / 2, y = 75 - size / 2; // centred on the bowl's ink
  const ink = options.background
    ? '<style>.ink{fill:#141414}</style>'
    : '<style>.ink{fill:#141414}@media (prefers-color-scheme:dark){.ink{fill:#F5F5F2}}</style>';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f(x)} ${f(y)} ${size} ${size}">${ink}`
    + (options.background ? `<rect x="${f(x)}" y="${f(y)}" width="${size}" height="${size}" fill="${options.background}"/>` : '')
    + `<mask id="bowl" maskUnits="userSpaceOnUse" x="${f(x)}" y="${f(y)}" width="${size}" height="${size}"><g fill="#fff" stroke="#000">${bowlShapes(gap)}</g></mask>`
    + `<rect class="ink" x="${f(x)}" y="${f(y)}" width="${size}" height="${size}" mask="url(#bowl)"/></svg>`;
}

/** The wordmark's inner markup; wrap it in an element with class "logo". */
export const LOGO_INNER_HTML = `SaladBo${glyph()}l`;

/** The complete wordmark, for static pages. */
export const LOGO_HTML = `<span class="logo" role="img" aria-label="SaladBowl">${LOGO_INNER_HTML}</span>`;

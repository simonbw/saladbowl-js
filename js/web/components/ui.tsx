'use strict';

/**
 * @file Small building blocks shared by the game screens.
 */

import React, { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';

import GameHelpers from '../../shared/GameHelpers';
import { PHASE_COUNT, getPhase } from '../../shared/Phases';
import { LOGO_INNER_HTML } from '../logo';
import { fitBlock, whenHandFontReady, type FitOptions } from '../penFit';
import { isMuted, setMuted, subscribeMuted } from '../Sounds';
import { Icon } from './Icons';
import ShareSheet from './ShareSheet';
import type { Game } from '../../shared/types';

export { Icon };

/** A full-height column; everything in the app sits in one. */
export function Screen(props: { children: React.ReactNode; className?: string }) {
  return <div className={'screen ' + (props.className ?? '')}>{props.children}</div>;
}

/** Pushes whatever follows to the bottom of the screen. */
export const Spacer = () => <div className="spacer"/>;

export function Logo() {
  return <span className="logo" role="img" aria-label="SaladBowl" dangerouslySetInnerHTML={{ __html: LOGO_INNER_HTML }}/>;
}

/** Logo on the left, something (usually the game code) on the right. */
export function Header(props: { right?: React.ReactNode }) {
  return (
    <header className="app-header">
      <a href="/" className="logo-link"><Logo/></a>
      {props.right}
    </header>
  );
}

/** The game code; tap it to share the game (link, QR code). */
export function CodeChip(props: { code: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="code-chip" aria-label={`Share game ${props.code}`} onClick={() => setOpen(true)}>
        {props.code} <Icon.Share/>
      </button>
      {open && <ShareSheet code={props.code} onClose={() => setOpen(false)}/>}
    </>
  );
}

/** A player's name. Names are written by players, so they're in the hand font (in caps). */
export function Name(props: { children: React.ReactNode }) {
  return <span className="name">{props.children}</span>;
}

/** "The Dilapidated Kangaroos" → "Kangaroos", for tight spots like the score line. */
export function shortTeamName(name: string): string {
  return name.split(' ').pop() ?? name;
}

const TEAM_COLORS = ['#D9622B', '#2F6FDB', '#2E9E5B', '#8A4FD8', '#C9A227', '#D14D8B'];

export function TeamDot(props: { index: number }) {
  return <span className="team-dot" style={{ background: TEAM_COLORS[props.index % TEAM_COLORS.length] }}/>;
}

/**
 * The in-game header: which round and its rule, the score, and the sound toggle.
 */
export function PhaseHeader(props: { game: Game }) {
  const phaseIndex = props.game.get('phaseIndex');
  const phase = getPhase(phaseIndex);
  const teams = GameHelpers.getTeams(props.game);
  return (
    <>
      <header className="phase-header">
        <span className="label">Round {phaseIndex + 1} of {PHASE_COUNT} · {phase.name}</span>
        <span className="scores">
          {teams.map((team: any) => `${shortTeamName(team.get('name'))} ${team.get('points').size}`).join(' · ')}
        </span>
      </header>
      <div className="phase-rule">
        <p>{phase.instructions}</p>
        <SoundToggle/>
      </div>
    </>
  );
}

function SoundToggle() {
  const muted = useSyncExternalStore(subscribeMuted, isMuted);
  return (
    <button type="button" className="icon-button" aria-label={muted ? 'Turn sound on' : 'Turn sound off'} aria-pressed={!muted} onClick={() => setMuted(!muted)}>
      {muted ? <Icon.SoundOff/> : <Icon.SoundOn/>}
    </button>
  );
}

/**
 * Player-written text that shrinks to fit its box, getting heavier as it
 * shrinks so the stroke stays the same ("same pen, smaller writing"). The
 * parent element is the box.
 */
export function FittedText(props: { text: string; fit: FitOptions; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { max, min, base } = props.fit;

  useLayoutEffect(() => {
    const el = ref.current;
    const box = el?.parentElement;
    if (!el || !box) {
      return;
    }
    const fit = () => {
      const style = getComputedStyle(box);
      const width = box.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const height = box.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      fitBlock(el, width, height, { max, min, base });
    };
    fit();
    // Refit once the hand font arrives (measurements before then are for the fallback) and on resize.
    let live = true;
    whenHandFontReady().then(() => live && fit());
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => {
      live = false;
      observer.disconnect();
    };
  }, [props.text, max, min, base]);

  return <span ref={ref} className={'hand ' + (props.className ?? '')}>{props.text}</span>;
}

/** A small chip-sized slip with a noun on it. */
export function MiniSlip(props: { children: React.ReactNode }) {
  return <span className="mini-slip hand">{props.children}</span>;
}

/** The little line-drawn bowl with three slips in it. */
export function BowlIcon(props: { size?: number }) {
  const w = props.size ?? 40;
  return (
    <svg className="bowl-icon" width={w} height={Math.round(w * 0.74)} viewBox="0 0 124 92" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" aria-hidden="true">
      <rect x="30" y="12" width="26" height="18" rx="1" fill="#FFF"/>
      <rect x="50" y="6" width="26" height="18" rx="1" fill="#FFF"/>
      <rect x="70" y="12" width="26" height="18" rx="1" fill="#FFF"/>
      <path d="M8 34h108c0 30-22 52-54 52S8 64 8 34z" fill="#FFF"/>
      <ellipse cx="62" cy="34" rx="54" ry="7" fill="#FFF"/>
    </svg>
  );
}

/** Tally marks, in groups of five that wrap if there are a lot of them. */
export function Tally(props: { count: number }) {
  const groups: number[] = [];
  for (let left = props.count; left > 0; left -= 5) {
    groups.push(Math.min(5, left));
  }
  return (
    <span className="tally" role="img" aria-label={`${props.count} tally marks`}>
      {groups.map((strokes, g) => {
        let d = '';
        for (let i = 0; i < Math.min(strokes, 4); i++) {
          d += `M${6 + i * 7} 5V27`;
        }
        if (strokes === 5) {
          d += 'M2 22L31 10';
        }
        const width = strokes === 5 ? 34 : strokes * 7 + 4;
        return (
          <svg key={g} width={width} height="32" viewBox={`0 0 ${width} 32`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d={d}/>
          </svg>
        );
      })}
    </span>
  );
}

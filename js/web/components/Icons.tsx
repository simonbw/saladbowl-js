'use strict';

import React from 'react';

const iconProps = {
  width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
} as const;

export const Icon = {
  Share: () => <svg {...iconProps}><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/></svg>,
  Plus: () => <svg {...iconProps}><path d="M12 5v14M5 12h14"/></svg>,
  Shuffle: () => <svg {...iconProps}><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>,
  Undo: () => <svg {...iconProps}><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>,
  SoundOn: () => <svg {...iconProps} width={17} height={17}><path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>,
  SoundOff: () => <svg {...iconProps} width={17} height={17}><path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M16 9l6 6M22 9l-6 6"/></svg>,
  Close: () => <svg {...iconProps} width={18} height={18}><path d="M6 6l12 12M18 6L6 18"/></svg>,
};

'use strict';

import React, { useEffect, useMemo, useState } from 'react';
import { encode } from 'uqr';

import { Icon } from './Icons';

/** Opened from the game-code chip: the code, a QR code, and a share/copy-link button. */
export default function ShareSheet(props: { code: string; onClose: () => void }) {
  const url = `${window.location.origin}/${props.code}`;
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share === 'function';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && props.onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [props.onClose]);

  const share = async () => {
    if (canShare) {
      try {
        await navigator.share({ title: 'SaladBowl', text: `Join my SaladBowl game (${props.code})`, url });
      } catch {
        // Cancelled, or the share sheet failed; nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', url);
    }
  };

  return (
    <div className="sheet-backdrop" onClick={props.onClose}>
      <div className="sheet" role="dialog" aria-label="Share this game" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="icon-button sheet-close" aria-label="Close" onClick={props.onClose}><Icon.Close/></button>
        <span className="label">Game code</span>
        <div className="sheet-code">{props.code}</div>
        <QrCode text={url}/>
        <button type="button" className="btn btn-primary" onClick={share}>
          {copied ? 'Link copied' : canShare ? 'Share link' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}

function QrCode(props: { text: string }) {
  const { path, size } = useMemo(() => {
    const qr = encode(props.text, { ecc: 'M', border: 2 });
    let d = '';
    qr.data.forEach((row, y) => row.forEach((dark, x) => {
      if (dark) {
        d += `M${x},${y}h1v1h-1z`;
      }
    }));
    return { path: d, size: qr.data.length };
  }, [props.text]);

  return (
    <svg className="qr-code" viewBox={`0 0 ${size} ${size}`} shapeRendering="crispEdges" role="img" aria-label={`QR code for ${props.text}`}>
      <rect width={size} height={size} fill="#fff"/>
      <path d={path} fill="#141414"/>
    </svg>
  );
}

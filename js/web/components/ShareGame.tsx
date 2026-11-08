'use strict';

import React, { useMemo, useState } from 'react';
import { encode } from 'uqr';

/** The game code, a share/copy-link button, and an optional QR code. */
export default function ShareGame(props: { code: string }) {
  const url = `${window.location.origin}/${props.code}`;
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const share = async () => {
    if (typeof navigator.share === 'function') {
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
    <div className="share-game">
      <div className="game-code-label">Game code</div>
      <div className="game-code">{props.code}</div>
      <div className="share-buttons">
        <button type="button" onClick={share}>{copied ? 'Link copied!' : 'Invite players'}</button>
        <button type="button" onClick={() => setShowQr(!showQr)}>{showQr ? 'Hide QR code' : 'QR code'}</button>
      </div>
      {showQr && <QrCode text={url} />}
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
      <rect width={size} height={size} fill="#fff" />
      <path d={path} fill="#111" />
    </svg>
  );
}

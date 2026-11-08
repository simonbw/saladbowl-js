'use strict';

import React, { useSyncExternalStore } from 'react';

import UIActions from '../actions/UIActions';
import { isMuted, setMuted, subscribeMuted } from '../Sounds';
import type { PageProps } from '../types';

/** A dismissable banner for the latest failed request. */
export function ErrorBanner(props: PageProps) {
  const error = props.state.get('ui').get('error');
  if (!error) {
    return null;
  }
  return (
    <div className="errors" role="alert">
      <div className="error dismissable" onClick={() => props.dispatch(UIActions.dismissError(error.get('id')))}>
        {error.get('message')}
        <span className="dismiss" aria-label="Dismiss">×</span>
      </div>
    </div>
  );
}

/** "Time's up!" and friends: a full-screen card that fades on its own. */
export function AnnouncementOverlay(props: PageProps) {
  const announcement = props.state.get('ui').get('announcement');
  if (!announcement) {
    return null;
  }
  return (
    <div
      className="announcement"
      role="status"
      key={announcement.get('id')}
      onClick={() => props.dispatch(UIActions.dismissAnnouncement(announcement.get('id')))}
    >
      <div className="announcement-card">
        <h1>{announcement.get('title')}</h1>
        {announcement.get('subtitle') && <p className="announcement-subtitle">{announcement.get('subtitle')}</p>}
        {announcement.get('detail') && <p className="announcement-detail">{announcement.get('detail')}</p>}
        <div className="announcement-hint">tap to close</div>
      </div>
    </div>
  );
}

/** Mute / unmute this device. */
export function SoundToggle() {
  const muted = useSyncExternalStore(subscribeMuted, isMuted);
  return (
    <button type="button" className="sound-toggle" onClick={() => setMuted(!muted)}>
      {muted ? 'Sound: off' : 'Sound: on'}
    </button>
  );
}

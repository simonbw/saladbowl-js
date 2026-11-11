'use strict';

import React from 'react';

import UIActions from '../actions/UIActions';
import { Icon } from './Icons';
import { Name } from './ui';
import type { PageProps } from '../types';

/** A dismissable banner for the latest failed request. */
export function ErrorBanner(props: PageProps) {
  const error = props.state.get('ui').get('error');
  if (!error) {
    return null;
  }
  return (
    <div className="banner" role="alert">
      <span>{error.get('message')}</span>
      <button type="button" className="icon-button" aria-label="Dismiss" onClick={() => props.dispatch(UIActions.dismissError(error.get('id')))}>
        <Icon.Close/>
      </button>
    </div>
  );
}

/** "Time's up!" and friends: a full-screen card that fades on its own. */
export function AnnouncementOverlay(props: PageProps) {
  const announcement = props.state.get('ui').get('announcement');
  if (!announcement) {
    return null;
  }
  const names: string[] = (announcement.get('names')?.toJS?.() ?? announcement.get('names') ?? []).filter(Boolean);
  return (
    <div
      className="announcement"
      role="status"
      key={announcement.get('id')}
      onClick={() => props.dispatch(UIActions.dismissAnnouncement(announcement.get('id')))}
    >
      <div className="announcement-card">
        <h1 className="title">{announcement.get('title')}</h1>
        {announcement.get('subtitle') && <p className="announcement-subtitle">{withNames(announcement.get('subtitle'), names)}</p>}
        {announcement.get('detail') && <p className="announcement-detail">{withNames(announcement.get('detail'), names)}</p>}
        <span className="announcement-hint">Tap to close</span>
      </div>
    </div>
  );
}

/** `text` with each of `names` set as a player name. */
function withNames(text: string, names: string[]): React.ReactNode {
  if (names.length === 0) {
    return text;
  }
  const escaped = names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Whole words only, so a short name doesn't match inside other words.
  const parts = text.split(new RegExp(`(?<![\\p{L}\\p{N}])(${escaped.join('|')})(?![\\p{L}\\p{N}])`, 'u'));
  return parts.map((part, i) => (i % 2 === 1 ? <Name key={i}>{part}</Name> : part));
}

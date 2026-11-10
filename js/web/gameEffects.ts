'use strict';

/**
 * @file Side effects of game events: sounds, vibration and announcements.
 */

import { getPhase } from '../shared/Phases';
import { pluralize } from '../shared/StringUtil';
import UIActions, { type Announcement } from './actions/UIActions';
import { diffGameEvents, type GameEvent } from './GameEvents';
import { playSound, vibrate } from './Sounds';
import type { AppState, Dispatch } from './types';

interface StoreLike {
  getState(): AppState;
  dispatch: Dispatch;
  subscribe(listener: () => void): () => void;
}

export function startGameEffects(store: StoreLike, userId: string): void {
  let prev = store.getState().get('game');
  store.subscribe(() => {
    const next = store.getState().get('game');
    if (next === prev) {
      return;
    }
    const events = diffGameEvents(prev, next);
    prev = next;
    events.forEach((event) => handleEvent(event, store, userId));
  });
}

function handleEvent(event: GameEvent, store: StoreLike, userId: string): void {
  const game = store.getState().get('game');
  const myTeam = game.get('players').find((p: any) => p.get('id') === userId)?.get('team');

  switch (event.type) {
    case 'timeUp': {
      // The team whose turn just ended hears the buzzer.
      if (myTeam === event.team) {
        playSound('time-up');
        vibrate([300, 100, 300]);
      }
      const you = event.playerId === userId;
      const announcement: Announcement = { title: "Time's up!", names: [event.playerName, event.nextPlayerName] };
      if (event.pointsThisTurn != null) {
        announcement.subtitle = `${you ? 'You' : event.playerName} got ${pluralize(event.pointsThisTurn, 'word')}.`;
      }
      announcement.detail = event.nextPlayerId === userId
        ? "You're up next!"
        : `Next up: ${event.nextPlayerName}`;
      store.dispatch(UIActions.showAnnouncement(announcement));
      break;
    }

    case 'phaseChanged': {
      const phase = getPhase(event.phaseIndex);
      const you = event.playerId === userId;
      const announcement: Announcement = {
        title: `Round ${event.phaseIndex + 1}: ${phase.name}`,
        subtitle: phase.instructions,
        names: [event.playerName],
      };
      if (event.secondsLeftover > 0) {
        announcement.detail = `The bowl is full again. ${you ? 'You keep' : `${event.playerName} keeps`} going with ` +
          `${event.secondsLeftover}s + ${event.bonusSeconds}s bonus.`;
      }
      if (you) {
        vibrate(200);
      }
      store.dispatch(UIActions.showAnnouncement(announcement));
      break;
    }

    case 'gameOver':
      playSound('time-up');
      break;
  }
}

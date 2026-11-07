'use strict';

import { api } from '../../convex/_generated/api';
import { createConvexClient } from './backend/convexClient';

/**
 * The "new game" form: create the game in Convex, then go to it. Replaces
 * `POST /new-game`.
 */
const form = document.getElementById('new-game-form') as HTMLFormElement;
const errorBox = document.getElementById('new-game-error') as HTMLElement;
const button = form.querySelector('button[type=submit]') as HTMLButtonElement;
const client = createConvexClient();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  button.disabled = true;
  errorBox.hidden = true;
  try {
    const code = await client.mutation(api.game.createGame, {
      wordsPerPlayer: Number(data.get('wordsPerPlayer')),
      secondsPerRound: Number(data.get('secondsPerRound')),
    });
    window.location.href = '/' + code;
  } catch (error) {
    console.error('failed to create game:', error);
    errorBox.textContent = 'Could not create a game. Check your connection and try again.';
    errorBox.hidden = false;
    button.disabled = false;
  }
});

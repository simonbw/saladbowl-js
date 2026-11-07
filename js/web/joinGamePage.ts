'use strict';

import { normalizeGameCode } from '../shared/GameCode';

/** The "join game" form: go to `/{code}`. */
const form = document.getElementById('join-game-form') as HTMLFormElement;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const code = normalizeGameCode(String(new FormData(form).get('game-id') ?? ''));
  if (code) {
    window.location.href = '/' + encodeURIComponent(code);
  }
});

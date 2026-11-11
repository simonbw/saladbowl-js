'use strict';

import React from 'react';

import { WatchingPage } from './TurnInfo';
import type { PageProps } from '../types';

/** The clue-giver's teammates. */
export default (props: PageProps) => <WatchingPage {...props} guessing={true}/>;

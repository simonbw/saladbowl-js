'use strict';

import React from 'react';

import { WatchingPage } from './TurnInfo';
import type { PageProps } from '../types';

/** Everyone on the other teams. */
export default (props: PageProps) => <WatchingPage {...props} guessing={false}/>;

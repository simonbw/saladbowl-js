import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.daily('delete old games', { hourUTC: 11, minuteUTC: 0 }, internal.game.deleteOldGames, {});

export default crons;

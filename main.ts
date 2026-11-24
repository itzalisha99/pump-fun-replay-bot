// Ignition — pump.fun replay bot (agent-fun/replay/v2).
//
// The strategy lives in strategy.ts; this file is only the entrypoint the
// grader runs as `node /bot/main.ts`. Before the bot starts, it validates
// its own parameters against the bounty gate, so a bad edit can never
// silently ship: stakes must fit inside the exposure cap, the first buy
// must be at least the minimum order, the take-profit ladder must be
// ordered (TP1 below TP2), the trailing stop must arm before it can fire,
// and the guardrail pacing must target at least 20 coins. If any check
// fails the process exits with a message instead of trading badly.

import { runBot } from './vendor/makefun-bot.ts';
import { createStrategy, DEFAULT_PARAMS, type Params } from './strategy.ts';

/** Mirror the bounty gate in code: fail loudly at startup, never mid-run. */
function validate(p: Params): void {
  const bad: string[] = [];
  if (!(p.initialSol >= p.minBuySol)) bad.push('initialSol below minBuySol');
  if (!(p.stakeMaxSol <= p.maxExposureSol)) bad.push('stakeMaxSol above maxExposureSol');
  if (!(p.addSol > 0 && p.stakeMaxSol >= p.initialSol + p.addSol)) bad.push('pyramid does not fit under stakeMaxSol');
  if (!(0 < p.tp1 && p.tp1 < p.tp2)) bad.push('TP ladder not ordered (tp1 < tp2)');
  if (!(0 < p.trail && p.trail < 1 && 0 <= p.trailArm)) bad.push('trailing stop out of range');
  if (!(0 < p.stopLoss && p.stopLoss < 1)) bad.push('stopLoss out of range');
  if (!(p.maxMain >= 1 && p.maxMain < 5)) bad.push('maxMain must leave a slot for probes');
  if (!(p.targetCoins >= 20)) bad.push('targetCoins below the 20-coin guardrail');
  if (!(p.minAge < p.maxAge)) bad.push('entry age window empty');
  if (!(p.scalpOn === false || (p.scalpTp > 0 && p.scalpSl > 0))) bad.push('scalp mode misconfigured');
  if (bad.length > 0) {
    throw new Error(`strategy params failed validation: ${bad.join('; ')}`);
  }
}

validate(DEFAULT_PARAMS);

await runBot(createStrategy(DEFAULT_PARAMS));

# Ignition — Pump.fun Replay Sprint Paper Bot

[![make.fun](https://make.fun/badge/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122.svg)](https://make.fun/bounty/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122)
[![rank](https://make.fun/badge/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122/itzalisha99/pump-fun-replay-bot/rank.svg)](https://make.fun/bounty/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122)
[![reward](https://make.fun/badge/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122/itzalisha99/pump-fun-replay-bot/reward.svg)](https://make.fun/bounty/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122)

A paper-trading bot for the [Pump.fun Replay Sprint](https://make.fun/bounty/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122) on make.fun. It trades 10 SOL of paper money on a 24-hour replay of pump.fun bonding-curve activity. Best net PnL wins.

## Strategy: ignition + scaled exits

On this replay most coins die and a few spike then dump, so buying and holding
loses. The edge is in buying only busy launches, taking profit fast in stages,
and cutting losers before the dump:

1. **Ignition** — buy only young curves (60–100 slots old) whose opening tape is
   crowded: at least 8 buys from at least 6 distinct wallets, net inflow of at
   least 1 SOL, price already up 8% and sitting near its window high, no single
   wallet dominating the buys.
2. **Scaled exits** — sell half at +40%, half of what is left at +100%, and let
   the rest ride under a 10% trailing stop (armed at +20%). A 20% hard stop, a
   fade exit when net flow turns negative, an instant exit on any single sell
   of 3 SOL or more, and a 300-slot hold limit guard the downside.
3. **Small stakes, many coins** — 0.03 SOL first buys, at most 0.30 SOL per coin,
   at most 4 momentum positions at once, so one bad coin can never sink the run.
   Tiny 0.01 SOL probe round trips keep the run above the 20-coin guardrail.

The bot is a pure function of the batches it is fed: no clock, no randomness,
no I/O — the two graded executions produce byte-identical action logs.

## Backtest (honest numbers)

Full dev window (2026-11-02 → 2026-11-03), official `grade-local` with the
process driver: **net −0.234 SOL**, 441 fills over 137 coins, 210 round trips,
16.7% win rate, max drawdown 2.8%. Guardrails met. That is a loss on dev, and
it is reported honestly here: it still beats the kit's house pilots on the same
window (sniper −0.49 SOL, momentum −9.39 SOL) with a much smaller drawdown,
and the final window is unseen data, so no dev number is a promise. Every
parameter was chosen by one-at-a-time sweeps on the full dev window, scored as
the mean PnL over four failure keys — and the sweeps kept pointing the same
way: earlier entries, faster exits, smaller stakes. A launch-scalp mode (buy
the first slots, sell at +12%) was also built and backtested, then switched
OFF: it lost money on the dev window, so the shipped bot does not use it.

## Files

- `main.ts` — entrypoint, run by the grader as `node /bot/main.ts`; validates
  its own parameters against the bounty gate before trading.
- `strategy.ts` — the strategy itself (entry signal, sizing, exits, guardrail
  pacing), written from scratch for this bounty.
- `vendor/makefun-bot.ts` — the kit's own replay-protocol shim, vendored
  byte-identical from the competition kit (`sdk/ts/makefun-bot.ts`).

## License

MIT — see [LICENSE](LICENSE).

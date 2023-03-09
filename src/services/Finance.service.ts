import {IMoneylineBet, Outcomes} from "../schema/Bet.schema.js";
import {IGameCrucial, IMoneyLineOdds, IOddsObj} from "../types/types.js";

export class FinanceService {
    margin: number

    constructor() {

    }

    //applies vig to bet
    computeVigMoneyline(money: number, odds: IMoneyLineOdds) {
        const awayImplied = odds.awayOdds < 0 ? odds.awayOdds / (odds.awayOdds + 100) * 100: 100 / (odds.awayOdds + 100) * 100
        const homeImplied = odds.homeOdds < 0 ? (odds.homeOdds / (odds.homeOdds + 100) * 100) : (100 / (odds.homeOdds + 100) * 100)
        const combined = awayImplied + homeImplied
        return Math.round((combined - 100) / combined)
    }

    //computes payout on win for data
    computePayout(bet: IMoneylineBet, event: IGameCrucial & { result: string }, type: 'moneyline' | 'spread' | 'total') {
        switch (type) {
            case "moneyline":
                const {outcome, team} = finance.checkWin(bet, event)
                const oddsTeam = team + 'Odds'
                if (outcome === Outcomes.win) {
                    const odds = event.odds[0].moneyline.current[oddsTeam as keyof IMoneyLineOdds]
                    return odds > 0 ? bet.money * (odds / 100) + bet.money : bet.money * (100 / odds) + bet.money
                } else if (outcome === Outcomes.draw) {
                    return bet.money
                } else {
                    return 0
                }
            default:
                return 0
        }
    }

    //checks the outcome of a bet against and event
    checkWin(bet: IMoneylineBet, event: IGameCrucial & { result: string }) {
        const {away, home} = event.teams
        const expected = bet.team === away.team ? 'away' : bet.team === home.team ? 'home' : undefined
        if (event.result === Outcomes.draw) {
            return {outcome: Outcomes.draw, expected}
        }
        const outcome = expected === event.result ? Outcomes.win : Outcomes.loss
        return {outcome, team: expected}
    }
}

export const finance = new FinanceService()

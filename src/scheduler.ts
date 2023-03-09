import {schedule} from 'node-cron'
import {config} from "dotenv";
import {bets} from "./services/Bet.service.js";
import {events} from "./services/Event.service.js";
import {Outcomes} from "./schema/Bet.schema.js";
import {settleBetTransaction} from "./transactions.js";
import {logger} from "./init/logger.js";
import {finance} from "./services/Finance.service.js";

config()

//schedules and starts a cron job
//todo: convert some obj into cron expr
export const job = schedule('* * 1 * * *', settleBets)

export async function settleBets() {
    logger.app.info('Running settler')
    const pending_ = await bets.getPending()
    const won_ = await events.getWon()
    if (!won_) {
        return
    }
    await Promise.all(pending_.map(async (bet) => {
        //check if pending bet is in won games
        const event_ = won_.find(won => won._id === bet.event)
        if (!event_) {
            return
        }
        const {outcome, team} = finance.checkWin(bet, event_)
        const odds = event_.odds[0].moneyline.current
        const _win = finance.computePayout(bet, event_, 'moneyline')
        const vig = outcome === Outcomes.win ? finance.computeVigMoneyline(bet.money, odds) : 0
        const payout = Math.round(_win - (_win / 100 * vig))
        const data = {user: bet.user, bet: bet._id, resolve: outcome, payout}
        console.log(data)
        const transaction = await settleBetTransaction(data)
        if (transaction.success) {
            await bets.settle(bet._id, outcome)
        } else {
            logger.app.info('Transaction error', transaction)
        }
    }))
}





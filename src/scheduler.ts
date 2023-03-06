import {schedule, ScheduleOptions} from 'node-cron'
import {config} from "dotenv";
import {bets} from "./services/Bet.service.js";
import {events} from "./services/Event.service.js";
import {Outcomes} from "./schema/Bet.schema.js";

config()

//schedules and starts a cron job
//todo: convert some obj into cron expr
export const job = schedule('* * 1 * * *', settleBets)
async function settleBets() {
    const pending_ = await bets.getPending()
    const won_ = await events.getWon()
    if (!won_) {
        return
    }
    await Promise.all(pending_.map(async (bet) => {
        const event_ = won_.find(won => won._id === bet.event)
        if (!event_) {
            return
        }
        const {away, home} = event_.teams
        const expected = bet.team === away.team ? 'away' : bet.team === home.team ? 'home' : undefined
        //data malformed
        if (!expected) {
            return;
        }
        const outcome = expected === event_.result ? Outcomes.win : event_.result === 'home' ? Outcomes.loss : event_.result === 'draw' ? Outcomes.draw : undefined
        //todo: should I throw ? cuz it gets lost otherwise and data is not corrected. need a way of sending feedback to Scraper
        if (!outcome) {
            return;
        }
        //todo: PAY BET TRANSACTION
        await bets.settle(bet._id, outcome)
    }))
}
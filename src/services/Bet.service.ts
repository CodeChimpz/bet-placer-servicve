import {Repository} from "knex-db-connector";
import {betsRepo, IMoneylineBet} from "../schema/Bet.schema.js";


export class BetService {
    repo: Repository<IMoneylineBet>

    constructor(repo: Repository<IMoneylineBet>) {
        this.repo = repo
    }

    //get bet for this event and user was already left
    async check(user_id: number, event_id: number) {
        return this.repo.find({
            where: (query) => query.where({user: user_id, event: event_id})
        })
    }

    //leave an unconfirmed bet
    async bet(dataObj: IMoneylineBet){
        const {outcome, money, team, event} = dataObj
        return this.repo.create({outcome, money, team, event})
    }

    //confirm the bet after validation
    async confirm(id: number) {
        return this.repo.edit({confirmed: true}, (query: any) =>
            query.where({_id: id}))
    }

    //get all unresolved bets
    async getPending() {
        return this.repo.find({
            where: (query) => {
                return query.where({settled: false})
            }
        })
    }

    //delete bet
    async delete(id: number) {
        return this.repo.delete((query) =>
            query.where({id: id})
        )
    }
}

export const bets = new BetService(betsRepo)
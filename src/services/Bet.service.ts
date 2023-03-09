import {Repository} from "knex-db-connector";
import {betsRepo, IMoneylineBet, Outcomes} from "../schema/Bet.schema.js";


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

    async findOne(id: number) {
        const res = await this.repo.find({
            where: (query) => query.where({_id: id})
        })
        return res[0]
    }

    //leave an unconfirmed bet
    async bet(dataObj: IMoneylineBet) {
        const { money, team, event, user} = dataObj
        return this.repo.create({money, user, team, event})
    }

    //confirm the bet after validation
    async confirm(id: number) {
        return this.repo.edit({confirmed: true}, (query: any) =>
            query.where({_id: id}))
    }

    //
    async settle(id: number, outcome: Outcomes) {
        return this.repo.edit({outcome: outcome, settled: true}, (query: any) =>
            query.where({_id: id}))
    }

    //get all unresolved bets
    async getPending() {
        return this.repo.find({
            where: (query) => {
                return query.where({settled: null})
            }
        })
    }

    //delete bet
    async delete(id: number): Promise<number> {
        return this.repo.delete((query) =>
            query.where({_id: id})
        )
    }

    async refund(id: number) {
        return this.repo.edit({refunded: true}, (query: any) =>
            query.where({_id: id}))
    }
}

export const bets = new BetService(betsRepo)
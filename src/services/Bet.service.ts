import {DataSource, Repository} from "knex-db-connector";
import {dataSource} from "../init/db.js";
import {betsRepo, IMoneylineBet} from "../schema/Bet.schema.js";
import {events, EventServiceRemote} from "./Event.service.js";
import {query} from "express";

export class BetService {
    repo: Repository<IMoneylineBet>

    constructor(repo: Repository<IMoneylineBet>) {
        this.repo = repo
    }

    async bet(dataObj: IMoneylineBet) {
        const {outcome, money, team, event} = dataObj
        return this.repo.create({outcome, money, team, event})
    }

    async settle(id: number): Promise<IMoneylineBet | undefined> {
        //todo: smth
        const edited = await this.repo.edit({settled: true}, (query: any) =>
            query.where({_id: id}))
        const res = await this.repo.find({
            where: (query: any) => query.where({_id: id})
        })
        return <IMoneylineBet>res[0]
    }

    async getPending(): Promise<Array<IMoneylineBet>> {
        return this.repo.find({
            where: (query) => {
                return query.where({settled: false})
            }
        })
    }
}

export const bets = new BetService(betsRepo)
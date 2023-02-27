import {DataSource, Repository} from "knex-db-connector";
import {dataSource} from "../init/db.js";
import {betsRepo} from "../schema/Bet.schema.js";
import {events, EventServiceRemote} from "./Event.service.js";

export class BetService {
    repo: Repository
    events: EventServiceRemote

    constructor(repo: Repository, events: EventServiceRemote) {
        this.repo = repo
        this.events = events
    }

    async bet() {
        //
        return this.events.get('63f8b2cb0943399ea18b872f')
    }
}

export const bets = new BetService(betsRepo,events)
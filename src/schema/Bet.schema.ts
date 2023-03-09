import {dataSource} from "../init/db.js";
import {SchemaDataTypes} from "knex-db-connector";
import {IOddsObj} from "../types/types.js";

export enum Outcomes {
    win = 'win',
    loss = 'loss',
    draw = 'draw',
    wait = 'wait'
}

const moneylineBetSchema = {
    user: {
        type: SchemaDataTypes.integer
    },
    team: {
        type: SchemaDataTypes.string
    },
    money: {
        type: SchemaDataTypes.integer
    },
    event: {
        type: SchemaDataTypes.string
    },
    confirmed: {
        type: SchemaDataTypes.boolean
    },
    settled: {
        type: SchemaDataTypes.string
    }
}

export interface IMoneylineBet {
    user: number,
    //team who the bet is placed on
    team: string
    money: number,
    event: string,
    //if the bet is confirmed by the service
    confirmed: boolean,
    //result on settle
    settled: Outcomes
}


export const betsRepo = await dataSource.createSchema<IMoneylineBet>('MoneylineBets', moneylineBetSchema, true)
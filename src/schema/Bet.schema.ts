import {dataSource} from "../init/db.js";
import {SchemaDataTypes} from "knex-db-connector";
import {IOddsObj} from "../types/types.js";

enum Outcomes {
    win = 'win',
    loss = 'loss',
    draw = 'draw'
}

const moneylineBetSchema = {
    user: {
        type: SchemaDataTypes.integer
    },
    outcome: {
        type: SchemaDataTypes.string
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
    won: {
        type: SchemaDataTypes.boolean
    }
}

export interface IMoneylineBet {
    user: number,
    outcome: Outcomes
    team: string
    money: number,
    event: string,
    confirmed: boolean,
    won: boolean
}


export const betsRepo = await dataSource.createSchema<IMoneylineBet>('MoneylineBets', moneylineBetSchema, true)
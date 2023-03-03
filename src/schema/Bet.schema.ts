import {dataSource} from "../init/db.js";
import {SchemaDataTypes} from "knex-db-connector";
import {IOddsObj} from "../ts/types";

enum Outcomes {
    win = 'win',
    loss = 'loss',
    draw = 'draw'
}

const moneylineBetSchema = {
    user:{
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
    settled: {
        type: SchemaDataTypes.boolean
    },
    wom: {
        type: SchemaDataTypes.boolean
    }
}

export interface IMoneylineBet {
    user: number,
    outcome: Outcomes
    team: string
    money: number,
    event: string,
    settled: boolean,
    won: boolean
}


export const betsRepo = await dataSource.createSchema('MoneylineBets', moneylineBetSchema, true)
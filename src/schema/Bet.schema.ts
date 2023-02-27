import {dataSource} from "../init/db.js";
import {SchemaDataTypes} from "knex-db-connector";

enum Outcomes {
    win = 'win',
    loss = 'loss',
    draw = 'draw'
}

const moneylineBetSchema = {
    outcome: {
        type: SchemaDataTypes.string
    },
    team: {
        type: SchemaDataTypes.string
    },
    money: {
        type: SchemaDataTypes.integer
    }
}

export const betsRepo = await dataSource.createSchema('MoneylineBets', moneylineBetSchema)
export interface IMoneyLineOdds {
    awayOdds: number
    homeOdds: number
}

export interface ISpreadOdds {
    away: number
    home: number
    awayOdds: number
    homeOdds: number
}

export interface ITotalOdds {
    overOdds: number
    underOdds: number
}

export interface IOdds<TOddType> {
    open: TOddType
    current: TOddType
}

export type IOddsObj = {
    spread: IOdds<ISpreadOdds>,
    moneyline: IOdds<IMoneyLineOdds>,
    total: IOdds<ITotalOdds>
}[]

export interface IGameCrucial {
    odds: IOddsObj,
    date: string,
    teams: { home: string, away: string }
}
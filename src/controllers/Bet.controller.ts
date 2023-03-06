import {LoggerService} from "mein-winston-logger";
import {bets, BetService} from "../services/Bet.service.js";
import {logger} from "../init/logger.js";
import {Request, Response} from "express";
import {events, EventServiceRemote} from "../services/Event.service.js";
import {config} from "dotenv";
import {leaveBetTransaction} from "../transactions.js";
import {Outcomes} from "../schema/Bet.schema.js";

config()
const {
    SERVICE_NAME,
    WALLET_SERVICE_NAME,
    AMQP_HOST
} = process.env

export class BetController {
    logger: LoggerService
    service: BetService
    remoteEvents: EventServiceRemote

    constructor(service: BetService, remoteEvents: EventServiceRemote, logger: LoggerService) {
        this.logger = logger
        this.service = service
        this.remoteEvents = remoteEvents
    }

    async get(req: Request, res: Response) {
        try {
            //get the bet data and the odds on which the bet was placed to check their relevance
            const {team, money, event, user} = req.body.bet
            const betContext = req.body.betContext
            //check relevance on Event service
            const check = await this.remoteEvents.checkOdds(event, betContext)
            if (!check) {
                res.status(400).json({
                    message: 'Data irrelevant',
                    description: 'Data for bet irrelevant, can\'t proceed with transaction '
                })
                return
            }
            //check if user already made bet
            const already_bet = await this.service.check(user, event)
            if (already_bet.length > 0) {
                res.status(400).json({
                    message: 'Data irrelevant',
                    description: 'You already made a moneyline bet on this event'
                })
                return
            }
            //todo: Should be a standalone Service ?
            //run TRANSACTION
            const bet = await this.service.bet({outcome: Outcomes.wait, team, money, event, confirmed: false, user})
            //todo: pass some descriptive data
            const trans_LEAVE_BET = await leaveBetTransaction({bet, money, user, date: Date()})
            if (trans_LEAVE_BET) {
                const confirmed = await this.service.confirm(bet._id)
                res.status(200).json({message: 'Successfully left bet', data: confirmed})
                return
            }
            await this.service.delete(bet._id)
            res.status(404).json({message: 'Error on transaction'})
            return
        } catch (e: any) {
            this.logger.app.error(e)
            res.status(500).json({message: 'Server error'})
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const id = req.body.id
            const is_ = this.service.find(id)
            if (!is_) {
                res.status(400).json({message: 'Bet not found'})
            }
            //todo: Start DELETE BET TRANSACTIONS
            //moeny back from wallet
            const deleted_ = await this.service.delete(id)
            res.status(200).json({message: 'Deleted bet'})
        } catch (e: any) {
            this.logger.app.error(e)
            res.status(500).json({message: 'Server error'})
        }
    }
}

export const betsController = new BetController(bets, events, logger)
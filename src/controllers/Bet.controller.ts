import {LoggerService} from "mein-winston-logger";
import {bets, BetService} from "../services/Bet.service.js";
import {logger} from "../init/logger.js";
import {raw, Request, Response} from "express";
import {events, EventServiceRemote} from "../services/Event.service.js";
import {AmqpBroker} from "mein-etcd-service-registry";
import {config} from "dotenv";
import {commiter} from "../init/registry.js";
import {leaveBetTransaction} from "../transactions.js";

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
            const {outcome, team, money, event, user} = req.body.bet
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
            //todo: Should be a standalone Service
            //run TRANSACTION
            const bet = await this.service.bet({outcome, team, money, event, settled: false, won: false, user})
            const trans_LEAVE_BET = await leaveBetTransaction({bet, money, user, date: Date()})
            if(!trans_LEAVE_BET){
                // await this.service.delete(bet)
                res.status(404).json({message: 'Error on transaction'})
                return
            }
            res.status(200).json({message: 'Successfully left bet'})
        } catch (e: any) {
            this.logger.app.error(e)
            res.status(500).json({message: 'Server error'})
        }

    }

}

export const betsController = new BetController(bets, events, logger)
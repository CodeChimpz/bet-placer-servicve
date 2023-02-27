import {LoggerService} from "mein-winston-logger";
import {bets, BetService} from "../services/Bet.service.js";
import {logger} from "../init/logger.js";
import {raw, Request, Response} from "express";

export class BetController {
    logger: LoggerService
    service: BetService

    constructor(service: BetService, logger: LoggerService) {
        this.logger = logger
        this.service = service
    }

    async get(req: Request, res: Response) {
        const result = await this.service.bet()
        res.status(200).json({data: result})
    }
}

export const betsController = new BetController(bets, logger)
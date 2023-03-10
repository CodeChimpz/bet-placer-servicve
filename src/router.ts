import e, {Request, Response} from "express";
import {registerEndpoint} from "mein-endpoint-registrator";
import {betsController} from "./controllers/Bet.controller.js";
import {logger} from "./init/logger.js";

export const router = e.Router()
const endpoints = {
    '/bet/post': betsController.get,
}
registerEndpoint<(req: Request, res: Response) => Promise<void>>(router, endpoints, betsController, {
    cache: true,
    logger: logger
})


import {EtcdRegistry } from "mein-etcd-service-registry";
import {registry, sidecar} from "../init/registry.js";
import {config} from "dotenv";
import axios from "axios";
import {logger} from "../init/logger.js";
import {IGameCrucial, IOddsObj} from "../types/types.js";
import * as assert from "assert";

config()

export class EventServiceRemote {
    //todo: cache like in Gateway service
    name: string
    registry: EtcdRegistry.ServiceRegistry

    constructor(registry: EtcdRegistry.ServiceRegistry, name: string) {
        this.registry = registry
    }

    //get game data by id and check against some data provided
    async checkOdds(_id: string, data: IGameCrucial): Promise<boolean> {
        try {
            const check = await sidecar.sendRequest({
                method: 'post',
                endpoint: '/game/get',
                name: String(process.env.EVENT_SERVICE_NAME),
                params: {API_KEY: String(process.env.EVENT_SERVICE_KEY)}
            }, {_id: _id})
            if (!check) {
                return false
            }
            //comapration
            const target = {
                odds: check.data.data.odds,
                date: check.data.data.schedule.date,
                teams: check.data.data.teams
            }
            assert.deepStrictEqual(data, target, 'Eventdata unequal')
            return true
        } catch (e: any) {
            logger.app.error(e)
            if (e.message !== 'Eventdata unequal') {
                throw e
            }
            return false
        }
    }

    //find won games
    async getWon(_id: string): Promise<boolean | undefined> {
        try {
            const get = await sidecar.sendRequest({
                method: 'post',
                endpoint: '/games/get',
                name: String(process.env.EVENT_SERVICE_NAME),
                params: {API_KEY: String(process.env.EVENT_SERVICE_KEY)}
            }, {_id: _id})
            return get.data.data.status === 'final'
        } catch (e: any) {
            logger.app.error(e)
            return
        }
    }
}

//
config()
const {EVENT_SERVICE_NAME} = process.env
export const events = new EventServiceRemote(registry, String(EVENT_SERVICE_NAME))

//

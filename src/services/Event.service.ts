import {ServiceRegistry} from "mein-etcd-service-registry";
import {registry} from "../init/registry.js";
import {config} from "dotenv";
import axios from "axios";
import {logger} from "../init/logger.js";

export class EventServiceRemote {
    //todo: cache like in Gateway service
    name: string
    registry: ServiceRegistry

    constructor(registry: ServiceRegistry, name: string) {
        this.registry = registry
    }

    //get game data by id
    async get(_id: string) {
        //todo: put this stuff into the registry service - axios and such
        try {
            const host = await this.registry.service('event')
            const eventual = host+'game/get'
            console.log(eventual)
            const response = await axios.post(eventual,{_id:_id})
            return response.data
        } catch (e: any) {
            logger.app.error(e)
        }
    }
}

//
config()
const {EVENT_SERVICE_NAME} = process.env
export const events = new EventServiceRemote(registry, String(EVENT_SERVICE_NAME))
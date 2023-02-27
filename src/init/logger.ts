import {WinstonLoggerService} from "mein-winston-logger";

export const logger = new WinstonLoggerService({
    console: true,
    path: './',
    maxsize: 4000000
})
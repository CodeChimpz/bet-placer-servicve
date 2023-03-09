import {app} from "./app.js";
import {logger} from "./init/logger.js";
import {config} from "dotenv";
import {job, settleBets} from "./scheduler.js";

config()
const {PORT} = process.env
//start scraping for won games on an api
await settleBets()
app.listen(PORT, () => {
    logger.app.info('Started on port ' + PORT)
})
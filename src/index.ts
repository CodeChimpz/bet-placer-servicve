import {app} from "./app.js";
import {logger} from "./init/logger.js";
import {config} from "dotenv";
import {job} from "./scheduler.js";

config()
const {PORT} = process.env
//start scraping for won games on an api
job.start
app.listen(PORT, () => {
    logger.app.info('Started on port ' + PORT)
})
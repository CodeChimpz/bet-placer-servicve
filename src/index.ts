import {app} from "./app.js";
import {logger} from "./init/logger.js";
import {config} from "dotenv";

config()
const {PORT} = process.env
//start scraping for won games on an api

app.listen(PORT, () => {
    logger.app.info('Started on port ' + PORT)
})
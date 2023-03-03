import {schedule, ScheduleOptions} from 'node-cron'
import {config} from "dotenv";
config()
//schedules and starts a cron job
export function scheduleJob(func: any, timeout: string, cronOptions: ScheduleOptions) {
    const job = schedule(timeout, func, cronOptions)
    job.start()
}

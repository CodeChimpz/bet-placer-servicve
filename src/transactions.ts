import {config} from "dotenv";
import {commiter} from "./init/registry.js";


config()
const {
    SERVICE_NAME,
    WALLET_SERVICE_NAME,
    WALLET_SERVICE_KEY,
} = process.env

export const leaveBetTransaction = async (walletData: any) => {
    return  commiter.twoPCommit([
        {
            endpoint: {
                endpoint: '/transactions/leave-bet',
                name: String(WALLET_SERVICE_NAME),
                auth: String(WALLET_SERVICE_KEY)
            },
            data: walletData
        }
    ])
}

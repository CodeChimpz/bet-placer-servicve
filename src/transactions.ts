import {config} from "dotenv";
import {commiter} from "./init/registry.js";


config()
const {
    SERVICE_NAME,
    WALLET_SERVICE_NAME,
    WALLET_SERVICE_KEY,
} = process.env

export const leaveBetTransaction = async (walletData: any) => {
    return commiter.twoPCommit([
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

export const refundBetTransaction = async (walletData: any) => {
    return commiter.twoPCommit([
        {
            endpoint: {
                endpoint: '/transactions/leave-refund',
                name: String(WALLET_SERVICE_NAME),
                auth: String(WALLET_SERVICE_KEY)
            },
            data: walletData
        }
    ])
}

export const settleBetTransaction = async (betData: any) => {
    return commiter.twoPCommit([
        {
            endpoint: {
                endpoint: '/transactions/resolve-bet',
                name: String(WALLET_SERVICE_NAME),
                auth: String(WALLET_SERVICE_KEY)
            },
            data: betData
        }
    ])
}

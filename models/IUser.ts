import { OpskinsBase } from "../lib/OpskinsBase";

interface IBalanceResult {
  balance: number
  credits: number
  balance_restricted: number
  credits_restricted: number
  cryptoBalances: {
    ETH: number
    WAX: number
  }
}

interface IProfile {
  id: number
  id64: string
  create_time: number
  password_set_time: number
  balance: {
    coins: number
    amount_coins_nocashout: number
    credits: number
  }
  showcases: number
  bumps: number
  username: string
  avatar: string
  name: {
    first: string
    last: string
  }
  email: {
    contact_email: string
    verified: boolean
    notifications: boolean
  }
  twofactor: {
    enabled: boolean
    enable_time: number
  }
  options: {
    trade_url: string
    balance_notify: number
    suggestion_type: number
    hidden_balance: boolean
    private_sales_list: boolean
  }
  preferred_lang: string
  sales_list: string
  personal_info: {
    country: string
    region: string
    city: string
    postal: string
    address: string
    dob: string
    phone: string
    gov_id: string
  }
}

const base = 'IUser'

export function getApi(api: OpskinsBase) {
  return {
    getBalance() {
      return api.apiHelpers.get<IBalanceResult>([base, 'GetBalance'], 'v1')
    },

    getProfile() {
      return api.apiHelpers.get<IProfile>([base, 'GetProfile'], 'v1')
    }
  }
}
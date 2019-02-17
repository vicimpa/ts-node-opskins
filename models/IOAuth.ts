import { OpskinsBase } from "../lib/OpskinsBase";

const base = 'IOAuth'

interface IClientObject {
  client_id: string
  name: string
  redirect_uri: string
  time_created: string
  has_secret: boolean
}

interface ICreateClientResponse {
  secret: string
  client: IClientObject
}

interface IGetOwnedClientListResponse {
  clients: IClientObject[]
}

interface IUpdateOptions {
  name?: string
  redirect_uri?: string
}

interface IUpdateClientResponse {
  client: IClientObject
}

export function getApi(api: OpskinsBase) {
  return {
    createClient(name: string, redirect_uri: string, can_keep_secret?: boolean) {
      let data: any = { name, redirect_uri }

      if (typeof can_keep_secret !== 'undefined')
        data = { ...data, can_keep_secret }

      api.apiHelpers.apiKeyRequired()
      return api.apiHelpers.post<ICreateClientResponse>([base, 'CreateClient'], 'v1', data)
    },

    deleteClient(client_id: string) {
      api.apiHelpers.apiKeyRequired()
      return api.apiHelpers.post<{}>([base, 'DeleteClient'], 'v1', { client_id })
    },

    getOwnedClientList() {
      api.apiHelpers.apiKeyRequired()
      return api.apiHelpers.get<IGetOwnedClientListResponse>([base, 'GetOwnedClientList'], 'v1')
    },

    resetClientSecret(client_id: string) {
      api.apiHelpers.apiKeyRequired()
      return api.apiHelpers.post<ICreateClientResponse>([base, 'ResetClientSecret'], 'v1', { client_id })
    },

    updateClient(client_id: string, update: IUpdateOptions) {
      let keys = Object.keys(update)

      if (!keys.length)
        throw new Error('Properties name or redirect_uri is required!')

      api.apiHelpers.apiKeyRequired()
      return api.apiHelpers.post<IUpdateClientResponse>([base, 'UpdateClient'], 'v1', { client_id, ...update })
    }
  }
}
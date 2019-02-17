import { Opskins } from "..";
import { Request } from "./Request";
import * as QUERY from "querystring";
import { parse as urlParse } from "url";

export interface IOAuthClient {
  name: string
  redirect_uri: string
  scope: TScope[]
}

export type TScope =
  'identity_basic' |
  'trades' |
  'items' |
  'transfer_items' |
  'instant_sell_recent_items' |
  'balance' |
  'purchase_keys' |
  'open_cases' |
  'deposit' |
  'identity' |
  'trades_no_2fa' |
  'manage_items' |
  'withdraw' |
  'edit_account' |
  'payments' |
  'purchase' |
  'cashout' |
  'convert'

interface IOAuthParams {
  mobile?: boolean
  permanent?: boolean
}

export class OAuthClient {
  private static clients: string[] = []

  private _baseUri = `https://oauth.opskins.com/v1`

  private _name: string = null
  private _redirect: string = null
  private _scope: TScope[] = null

  private _secret: string = null
  private _client_id: string = null

  private api: Opskins = null

  public get name() {
    return this.name
  }

  public get redirect() {
    let { path } = urlParse(this._redirect)
    return path
  }

  public get client_id() {
    if (!this._client_id)
      throw new Error('Please first step call sync method')

    return this._client_id
  }

  public get secret() {
    if (!this._secret)
      throw new Error('Please first step call sync method')

    return this._secret
  }

  constructor(apiKey: string, other: IOAuthClient) {
    this.api = new Opskins(apiKey)

    this._name = other.name
    this._redirect = other.redirect_uri
    this._scope = other.scope
  }

  public async sync() {
    let { api, _name, _redirect } = this
    let { clients } = await api.IOAuth.getOwnedClientList()
    let [client] = clients.filter(e =>
      OAuthClient.clients.indexOf(e.client_id) === -1)

    if (!client) {
      let { client: newClient, secret } =
        await api.IOAuth.createClient(_name, _redirect)

      this._secret = secret
      client = newClient
    } else {
      let { client_id, name, redirect_uri } = client
      let { secret } = await api.IOAuth.resetClientSecret(client_id)
      this._secret = secret

      if (name !== _name || redirect_uri !== _redirect)
        await api.IOAuth.updateClient(client_id, {
          name: _name,
          redirect_uri: _redirect
        })
    }

    this._client_id = client.client_id
    OAuthClient.clients.push(client.client_id)
  }

  public getAuthUri(state: string, dop?: IOAuthParams) {
    let { mobile = false, permanent = false } = dop || {}
    let { client_id, _redirect, _scope, _baseUri } = this
    let scopeString = _scope.join(' ')
    let response_type = 'code'
    let params: any = { client_id, redirect_uri: _redirect }

    params = { ...params, scope: scopeString }
    params = { ...params, response_type, state }

    if (mobile)
      params = { ...params, mobile: 1 }

    if (permanent)
      params = { ...params, duration: 'permanent' }


    let query = QUERY.stringify(params)

    return `${_baseUri}/authorize?${query}`
  }

  public async getToken(controlState: string, query: any) {
    let { client_id, _scope, _baseUri, _secret } = this
    let { state, code, error: err } = query
    let auth: [string, string] = [client_id, _secret]
    let method = 'POST', url = `${_baseUri}/access_token`
    let headers = { 'content-type': 'application/x-www-form-urlencoded' }
    let body = QUERY.stringify({ code, grant_type: 'authorization_code' })

    if (!state || !code)
      throw new Error(err || 'Invalid query')

    if (state !== controlState)
      throw new Error('Invalid state')

    let { responseData } = await Request.req({ 
      method, url, headers, auth, body })
    let responseParsed = JSON.parse(responseData.toString())

    let { error, error_message } = responseParsed

    if (error)
      throw new Error(`${error} ${error_message}`)

    let { access_token, token_type, expires_in, scope } = responseParsed

    if (typeof access_token !== 'string')
      throw new Error('Invalid oauth response')

    if (token_type !== 'bearer')
      throw new Error('Invalid oauth response')

    if (typeof expires_in !== 'number')
      throw new Error('Invalid oauth response')

    if (typeof scope !== 'string')
      throw new Error('Invalid oauth response')

    let scopes = scope.split(/\s+/)

    for (let s of _scope)
      if (scopes.indexOf(s) === -1)
        throw new Error('Invalid scope!')

    return { access_token, token_type, expires_in, scope }
  }

  public async remove() {
    let { api } = this
    let { clients } = await api.IOAuth.getOwnedClientList()

    clients = clients.filter(e =>
      OAuthClient.clients.indexOf(e.client_id) === -1)

    for (let { client_id } of clients)
      api.IOAuth.deleteClient(client_id)
  }
}
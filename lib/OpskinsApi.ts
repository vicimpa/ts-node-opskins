import { StatusCode } from "../status";
import { OpskinsBase } from "./OpskinsBase"
import { Request } from "./Request";

export class OpskinsApi {
  constructor(private api: OpskinsBase) { 0 }

  get auth(): string | [string] | [string, string] {
    return this.api['_auth']
  }

  async get<T = any>(urls: string[] | string, version: 'v1' | 'v2' = 'v1', data: any = {}) {
    let url = this.path(urls, version)
    return this.parse<T>(await Request.get(url, data, this.auth), url)
  }

  async post<T>(urls: string[] | string, version: 'v1' | 'v2' = 'v1', data: any = {}) {
    let url = this.path(urls, version)
    return this.parse<T>(await Request.post(url, data, this.auth), url)
  }

  public apiKeyRequired() {
    if (!this.auth)
      throw new Error('This method need apikey required')
  }

  private path(urls: string[] | string, version: 'v1' | 'v2' = 'v1') {
    let url: string = ''

    if (Array.isArray(urls))
      url = urls.join('/')
    else
      url = urls

    return this.api['_base'] + (`${url}/${version}/`.replace(/\/+/g, '/'))
  }

  private parse<T = any>(data: any, url: string = ''): T & { time: Date } {
    let { status, time, response, message, error, error_description , ...meta } = data
    let statusName = status || error
    let statusDescription = message || StatusCode[status] || error_description

    if (status !== 1)
      throw new Error(`status code ${statusName}: ${statusDescription} ${url}`)

    let result = { time: new Date(time * 1000), ...response }

    if (Object.keys(meta).length)
      result = { ...result, ...meta }

    return result
  }
}
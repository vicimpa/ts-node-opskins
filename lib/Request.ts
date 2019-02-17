import { request as httpRequest } from "http";
import { request as httpsRequest } from "https";
import { LIMITTER } from "../config";

import { Base64 } from "./Base64";

import { IncomingHttpHeaders } from "http";

import * as QUERY from "querystring";
import { parse as parseUrl } from "url";

type TData = { [key: string]: string | number | boolean }
type TAuth = string | [string] | [string, string]

interface IOptionsRequest {
  headers?: IncomingHttpHeaders
  auth?: TAuth
  data?: TData
  body?: Buffer | string
  method?: string
  query?: TData
  url: string
}

interface IResponse {
  headers: IncomingHttpHeaders
  statusCode: number
  responseData: Buffer
}

export class Request {
  public static async req(params: IOptionsRequest) {
    let { method = "GET", url, headers = {}, auth, body, query } = params
    let { protocol, host, path, port, query: qq } = parseUrl(url, true)
    let requestFunc = protocol === 'https:' ? httpsRequest : httpRequest
    let queryString = QUERY.stringify({ ...qq, ...query })

    if (queryString)
      path += `?${queryString}`

    return LIMITTER.asyncInit()
      .then(() => new Promise<IResponse>((resolve, reject) => {
        let req = requestFunc({ method, protocol, host, path, port }, (res) => {
          let { statusCode, headers } = res
          let responseBytes: number[] = []
  
          res.on('data', (chank: Buffer) =>
            chank.map(byte => responseBytes.push(byte)))
  
          res.on('error', (error: Error) =>
            reject(error))
  
          res.on('end', () =>
            resolve({ statusCode, headers, responseData: Buffer.from(responseBytes) }))
        })
  
        req.on('error', (error: Error) =>
          reject(error))
  
        for (let name in headers)
          req.setHeader(name, headers[name])
  
        switch (typeof auth) {
          case 'string':
            req.setHeader('Authorization', `Bearer ${auth}`)
            break
  
          case 'object':
            if (!Array.isArray(auth))
              break
  
            if (auth.length === 1)
              auth.push('')
  
            req.setHeader('Authorization', `Basic ${Base64.encode(auth.join(':'))}`)
            break
        }
  
        if (body)
          return req.write(body, () => req.end())
  
        req.end()
      }))
  }

  public static async get(url: string, data?: TData, auth?: TAuth) {
    let options = { method: 'GET', url, query: data, auth }
    let response = await Request.req(options)
    let responseString = response.responseData.toString('utf-8')

    try {
      return JSON.parse(responseString)
    } catch (e) {
      return responseString
    }
  }

  public static async post(url: string, data?: TData, auth?: TAuth) {
    let options = {
      method: 'POST', url, auth,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    }

    let response = await Request.req(options)
    let responseString = response.responseData.toString('utf-8')

    try {
      return JSON.parse(responseString)
    } catch (e) {
      return responseString
    }
  }
}
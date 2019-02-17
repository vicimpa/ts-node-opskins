import { OpskinsBase } from "../lib/OpskinsBase";

interface ICaseObject {
  id: number
  name: string
  image: {
    '300px': string
    '600px': string
    '900px': string
    '1800px': string
    '2500px': string
  }
  skus: number[]
  key_amount_per_case: number
  max_opens: number
  remaining_opens: number
  flags: {
    [key: string]: boolean
  }
}

interface ICaseSchemaResult {
  cases: ICaseObject[]
}

const base = 'ICase'

export function getApi(api: OpskinsBase) {
  return {
    getCaseSchema(...ids: number[]) {
      let data = ids.length ? { 'cases': ids.join(',') } : {}
      return api.apiHelpers.get<ICaseSchemaResult>([base, 'GetCaseSchema'], 'v1', data)
    }
  }
}
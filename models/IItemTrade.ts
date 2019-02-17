import { OpskinsBase } from "../lib/OpskinsBase";

interface IItemObject {
  def_id: number
  internal_app_id: number
  name: string
  market_name: string
  color: string
  image: {
    '300px': string
    '600px': string
    '900px': string
    '1800px': string
    '2500px': string
  }
  suggested_price: number
  suggested_price_floor: number
  attributes?: {[key: string]: number | string | boolean}
  wear_tier_index: number
  type: string
  category: string
  rarity: string
  paint_index: number
}

interface IGetItemResult {
  items: {
    [id: string]: {
      '1': IItemObject
      '2'?: IItemObject
      '3'?: IItemObject
      '4'?: IItemObject
      '5'?: IItemObject
    }
  }
}

const base = 'IItem'

export function getApi(api: OpskinsBase) {
  return {
     getCaseSchema(...skus: number[]) {
      let data = skus.length ? {'sku_filter': skus.join(',')} : {}
      return api.apiHelpers.post<IGetItemResult>([base, 'GetItems'], 'v1', data)
    }
  }
}
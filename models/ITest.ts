import { OpskinsBase } from "../lib/OpskinsBase";

interface ITestResult { }

interface ITestAuthedResult {
  uid: number
  id64: number
  balance: number
  credits: number
  balance_in_keys: number
  cryptoBalances: {
    ETH: number
    WAX: number
  }
}

interface ITestLocalizationResult {
  lang: string
  test_string: string
}

const base = 'ITest'

export function getApi(api: OpskinsBase) {
  return {
    getTest() {
      return api.apiHelpers.get<ITestResult>([base, 'Test'], 'v1')
    },

    postTest() {
      return api.apiHelpers.post<ITestResult>([base, 'Test'], 'v1')
    },

    getTestAuthed() {
      api.apiHelpers.apiKeyRequired()
      return api.apiHelpers.get<ITestAuthedResult>([base, 'TestAuthed'], 'v1')
    },

    postTestAuthed() {
      api.apiHelpers.apiKeyRequired()
      return api.apiHelpers.post<ITestAuthedResult>([base, 'TestAuthed'], 'v1')
    },

    getTestBody() {
      api.apiHelpers.apiKeyRequired()
      return api.apiHelpers.get<ITestLocalizationResult>([base, 'TestLocalization'], 'v1')
    },

    postTestBody() {
      api.apiHelpers.apiKeyRequired()
      return api.apiHelpers.post<ITestLocalizationResult>([base, 'TestLocalization'], 'v1')
    }
  }
}
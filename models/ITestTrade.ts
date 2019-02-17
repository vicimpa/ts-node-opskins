import { OpskinsBase } from "../lib/OpskinsBase";

interface ITestResult { }

interface ITestAuthedResult {
  uid: number
}

interface ITestBodyResult {
  [key: string]: string | number | boolean
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

    getTestBody(body: object) {
      api.apiHelpers.apiKeyRequired()
      return api.apiHelpers.get<ITestBodyResult>([base, 'TestBody'], 'v1', body)
    },

    postTestBody(body: object) {
      api.apiHelpers.apiKeyRequired()
      return api.apiHelpers.post<ITestBodyResult>([base, 'TestBody'], 'v1', body)
    }
  }
}
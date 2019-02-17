import { OpskinsApi } from "./OpskinsApi";

export class OpskinsBase {
  private _auth: string | [string] | [string, string] = null

  public apiHelpers: OpskinsApi

  constructor()
  constructor(apiKey: string, isToken?: boolean)
  constructor(login: string, password: string)
  constructor(...args: any[]) {
    this.setAuth(args[0], args[1])
  }

  setAuth(apiKey: string, isToken?: boolean)
  setAuth(login: string, password: string)
  setAuth(...args: any[]) {
    this.apiHelpers = new OpskinsApi(this)

    let [arg1, arg2] = args

    if (typeof arg1 !== 'string')
      return

    if (arg2 === true)
      this._auth = arg1
    else {
      if (typeof arg2 === 'string')
        this._auth = [arg1, arg2]
      else
        this._auth = [arg1]
    }
  }
}
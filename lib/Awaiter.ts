function delay(n: number) {
  return new Promise<void>(
    r => setTimeout(r, n))
}

type TT = () => void

export class AwaitLimit {
  private _r: TT[] = []
  private _d = 0

  constructor(col: number, time: number = 1000) {
    this._d = time / col

    this.loop()
      .catch(console.error)
  }

  async loop() {
    while(true) {
      if(this._r.length)
        this._r.shift()()

      await delay(this._d)
    }
  }

  async asyncInit() {
    return new Promise<void>(r => 
      this._r.push(r))
  }
}

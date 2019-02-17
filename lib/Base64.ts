export class Base64 {
  public static encode(input: string = '') {
    return Buffer.from(input, 'utf-8').toString('base64')
  }

  public static decode(input: string = '') {
    return Buffer.from(input, 'base64').toString('utf-8')
  }
}
type ErrorsType = Record<
  string,
  {
    msg: string
    location: string
    value: any
    path: string
    [key: string]: any
  }
>
//  {key : [string]:  {
//   msg: string
//   location: string
//   value: any
// path: string (req.body || req.params || ...)
// } }
export class ErrorWithStatus {
  message: string
  status: number

  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {}

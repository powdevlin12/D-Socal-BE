// import { Response } from 'express'

// const STATUS_CODE = {
//   OK: 200,
//   CREATED: 201
// }

// const RESPONSE_STATUS_CODE = {
//   CREATED: 'Created',
//   OK: 'Success'
// }

// class SuccessResponse {
//   constructor({message: string, statusCode = STATUS_CODE.OK, reasonStatusCode = RESPONSE_STATUS_CODE.OK, metadata = {}}) {
//     this.message = message
//     this.status = statusCode
//     this.metadata = metadata
//   }

//   send(res, header = {}) {
//     return res.status(this.status).json(this)
//   }
// }

// class OK extends SuccessResponse {
//   constructor(message: string, metadata: any) {
//     super(message, metadata)
//   }
// }

// class CREATED extends SuccessResponse {
//   constructor()
// }

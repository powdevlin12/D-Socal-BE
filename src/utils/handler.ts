import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Hàm asyncHandler giúp xử lý các hàm route handler bất đồng bộ
 * bằng cách tự động bắt các lỗi và chuyển chúng đến middleware xử lý lỗi.
 *
 * @param fn - Một hàm route handler bất đồng bộ
 * @returns Một hàm route handler mới được bao bọc
 */
const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export default asyncHandler

import { UserVerifyStatus } from '~/constants/enums'

export interface IRefreshTokenParameter {
  refreshToken: string
  user_id: string
  verify: UserVerifyStatus
  exp: number
}

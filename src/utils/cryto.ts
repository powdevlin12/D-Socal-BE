import { createHash } from 'crypto'

function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

export function hashPassword(password: string) {
  return sha256(password)
}

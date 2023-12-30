import { Request } from 'express';

export function extractBearerToken(request: Request): string | null {
  if (
    !request.headers.authorization ||
    request.headers.authorization.split(' ')[0] !== 'Bearer'
  ) {
    return null;
  }
  return request.headers.authorization.split(' ')[1];
}

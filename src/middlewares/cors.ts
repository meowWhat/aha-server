import { Request, Response } from 'express'

export const cors = (req: Request, res: Response, next: Function) => {
  res.set('Access-Control-Allow-Origin', req.headers.origin)
  next()
}

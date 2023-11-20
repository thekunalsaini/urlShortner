import { Request, Response, NextFunction } from 'express'
import * as dotenv from 'dotenv'
dotenv.config()

export const validator = ( req: Request, res: Response, next: NextFunction ) => {
  //TODO: implement some security
  next()
} 

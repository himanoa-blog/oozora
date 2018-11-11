import * as Express from "express";
import * as mysql from "promise-mysql";

export interface ErrorResponse {
  error: string
}

export function wrapAsync(fn: (req: Express.Request, res: Express.Response, next: Express.NextFunction) => Promise<any>) {
  return (req: Express.Request, res: Express.Response, next: Express.NextFunction) => fn(req, res, next).catch(err => next(err))
}

export function errorHandler(err: Error, _req: Express.Request, res: Express.Response, _next: Express.NextFunction) {
  console.error(err);
  res.status(500).json({error: err.message})
}

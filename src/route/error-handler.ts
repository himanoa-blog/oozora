import * as Express from "express";

export interface ErrorResponse {
  error: string;
}

export function wrapAsync(
  fn: (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => Promise<any>
) {
  return (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) =>
    fn(req, res, next).catch(err => {
      res.status(400).json({ error: err.message });
    });
}

export function errorHandler(
  err: Error,
  _req: Express.Request,
  res: Express.Response,
  _next: Express.NextFunction
) {
  console.dir(err);
}

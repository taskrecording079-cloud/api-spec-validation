import { Request, Response, NextFunction } from "express"
import logger from "../utils/logger"

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Can use err.message to show a better message but then custom create Error object.
  //To not expose raw error messages.
  logger.error(err)
  res.status(err.status || 500).json({
    success: false,
    message: "Internal Server Error",
  })
}

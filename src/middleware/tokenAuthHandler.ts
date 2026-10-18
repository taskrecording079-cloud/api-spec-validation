import { Request, Response, NextFunction } from "express"
import { config } from "../config"
import logger from "../utils/logger"

export const tokenAuthHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  const path = req.baseUrl

  let expectedSecret
  if (path === "/health") {
    expectedSecret = config.healthSecret
  } else if (path === "/logs") {
    expectedSecret = config.logSecret
  }

  const requestToken = authHeader?.split(" ")[1]

  if (!authHeader?.startsWith("Bearer ") || requestToken != expectedSecret) {
    logger.error(
      `Authenticating Credentials, Path: ${path}. Token: ${requestToken}`
    )
    res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    })
    return
  }

  next()
}

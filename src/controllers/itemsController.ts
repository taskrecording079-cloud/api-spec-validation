import { Request, Response, NextFunction } from "express"
import {
  ItemsServiceError,
  listItems,
  parseLimit,
} from "../services/itemsService"

export const getItems = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const limit = parseLimit(req.query.limit)
    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined
    const result = listItems(cursor, limit)
    res.json(result)
  } catch (error) {
    if (error instanceof ItemsServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      })
      return
    }
    next(error)
  }
}

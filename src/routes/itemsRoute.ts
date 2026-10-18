import { Router } from "express"
import { getItems } from "../controllers/itemsController"

const router = Router()

router.get("/", getItems)

export default router

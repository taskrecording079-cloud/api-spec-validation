import { Router } from "express"
import { getLogs } from "../controllers/logsController"
import { tokenAuthHandler } from "../middleware/tokenAuthHandler"

const router = Router()

router.get("/download", tokenAuthHandler, getLogs)

export default router

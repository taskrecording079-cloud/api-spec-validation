import { Router } from "express"
import homeRoute from "./homeRoute"
import healthRoute from "./healthRoute"
import logsRoute from "./logsRoute"
import itemsRoute from "./itemsRoute"
import openapiRoute from "./openapiRoute"

const router = Router()

router.use("/", homeRoute)
router.use("/", openapiRoute)
router.use("/health", healthRoute)
router.use("/logs", logsRoute)
router.use("/api/v1/items", itemsRoute)

export default router

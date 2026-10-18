import { Router } from "express"
import path from "path"
import fs from "fs"

const router = Router()
const specPath = path.join(process.cwd(), "openapi.yaml")

router.get("/openapi.yaml", (_req, res, next) => {
  fs.readFile(specPath, "utf8", (err, content) => {
    if (err) {
      next(err)
      return
    }
    res.type("application/yaml").send(content)
  })
})

export default router

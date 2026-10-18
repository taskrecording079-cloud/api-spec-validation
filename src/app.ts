import express, { Express } from "express"
import { json, urlencoded } from "body-parser"
import routes from "./routes"
import { errorHandler } from "./middleware/errorHandler"

const app: Express = express()

app.use(json())
app.use(urlencoded({ extended: true }))

// Routes
app.use("/", routes)

// Error Handling Middleware
app.use(errorHandler)

export default app

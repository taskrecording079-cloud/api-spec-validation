import express, { Express } from "express"
import { json, urlencoded } from "body-parser"
import routes from "./routes"
import { errorHandler } from "./middleware/errorHandler"
import { rateLimitHeaders } from "./middleware/rateLimitHeaders"

const app: Express = express()

app.use(json())
app.use(urlencoded({ extended: true }))
app.use(rateLimitHeaders)

// Routes
app.use("/", routes)

// Error Handling Middleware
app.use(errorHandler)

export default app

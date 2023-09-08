import express from "express"
import cors from "cors"
import routerChoices from "./routes/routesChoices.js"
import routerPolls from "./routes/routesPolls.js"
import routerResult from "./routes/routesResults.js"


const app = express()
app.use(cors())
app.use(express.json())
app.use(routerPolls)
app.use(routerChoices)
app.use(routerResult)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
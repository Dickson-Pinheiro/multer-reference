import * as url from 'url'
import path from "path"
import express from "express"
import cors from "cors"
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import {routes} from "./routes.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/files", express.static(path.resolve(__dirname, "..", "tmp", "uploads")))

app.use(routes)


app.listen(5000)
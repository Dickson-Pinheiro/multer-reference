import { Router } from "express"
import { postsCollection } from "./database/database.js"
import { multerConfig } from "./config/multerConfig.js"
import multer from "multer"

const routes = Router()

routes.get("/posts", async (req, res) => {
    const posts = await postsCollection.find({}).toArray()
    if (!posts) {
        return res.status(404).send({ message: "posts not found" })
    }
    return res.send(posts)
})

routes.post("/posts", multer(multerConfig).single("file"), async (req, res) => {
    const { originalname: name, size, key, location: url = "" } = req.file;
    console.log(req.file)
    await postsCollection.insertOne({ name, size, key, url })

    return res.status(201).send()
})

export { routes }
import {MongoClient} from "mongodb"
import dotenv from "dotenv"

dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL)
await mongoClient.connect()
const uploadDb = mongoClient.db()

const postsCollection = uploadDb.collection("posts")

export {postsCollection}
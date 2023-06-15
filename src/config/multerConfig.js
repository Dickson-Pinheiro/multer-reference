import * as url from 'url'
import multer from "multer";
import path from "path";
import crypto from "crypto";
import aws from "aws-sdk";
import multerS3 from "multer-s3";
import dotenv from "dotenv"

dotenv.config()

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024;


const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
        },
        filename: (req, file, cb) => {
          const initialName = crypto.randomBytes(16).toString("hex");
          file.key = `${initialName}-${file.originalname}`
          cb(null, file.key)
        },
      }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: process.env.BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                file.key = `${hash.toString("hex")}-${file.originalname}`;

                cb(null, file.key);
            });
        }
    })
}


const multerConfig = {
    dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits: {
        fileSize: MAX_SIZE_TWO_MEGABYTES,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/gif",
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type."));
        }
    }
}

export { multerConfig }
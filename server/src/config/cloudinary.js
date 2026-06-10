import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME||"dzopb3luc",

  api_key: process.env.CLOUDINARY_API_KEY||"268212947317322",

  api_secret: process.env.CLOUDINARY_API_SECRET||"uuGoz4k1R6OH1KuuzD9Ar3Cdccs",
});

export default cloudinary;
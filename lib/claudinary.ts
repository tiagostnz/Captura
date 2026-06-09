import { v2 as cloudinary } from "cloudinary";
// basicamente isso é o acesso da minha nuvem que eu gerei dentro do cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

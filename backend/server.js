import app from "./app.js";
import cloudinary from "cloudinary";

// Cloudinary config (keep existing)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  console.log(`Ollama endpoint: ${process.env.OLLAMA_BASE_URL || "http://localhost:11434"}`);
});

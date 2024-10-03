import express from "express";
import { addFood,listFood,removeFood } from "../controllers/foodController.js";
import multer from "multer";
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser'; // Add body-parser


const foodRouter = express.Router();

// Middleware for parsing form-data
foodRouter.use(bodyParser.urlencoded({ extended: true }));
foodRouter.use(bodyParser.json());

// Create 'uploads' directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir); // Create uploads folder if it doesn't exist
}

// Image storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads"); // Ensure multer saves files to 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Route to add a food item
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get('/list',listFood);
foodRouter.post('/remove',removeFood);

export default foodRouter;

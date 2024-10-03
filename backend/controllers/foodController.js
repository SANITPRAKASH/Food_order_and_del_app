import foodModel from '../models/foodModel.js';
import fs from 'fs'; // Ensure fs is imported

// Add food item
const addFood = async (req, res) => {
    // Debugging logs
    console.log("File received:", req.file); // Check if file is being received
    console.log("Request body:", req.body); // Check the body data

    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.error("Error while saving food:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// List all food items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        // Delete the image file
        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
        });

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
};

// Export the functions
export { addFood, listFood, removeFood };

const User = require("../model/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../services/authService");
const Product = require("../model/Product");

const product = async (req, res) => {
    try {
        const products = Product.find({});
        //return
        return res.status(200).json({
            message: "All Product",
            product: products,
        });
    } catch (error) {
        console.log(error);
    }
};

const addproduct = async (req, res) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing in Authorization header" });
        }

        console.log(token);
        console.log("JWT Secret:", process.env.JWT_SECRET);

        // Verify token
        let decodedToken;
        try {
            decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decodedToken);

        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Find user by email from token
        const userData = await User.findOne({ email: decodedToken.email });
        if (!userData) {
            return res.status(401).json({ message: "User not found" });
        }

        // Destructure product data from body
        const {
            name,
            brand,
            price,
            description,
            image,
            category,
            stock,
            rating,
        } = req.body;

        // Validate required fields (rating optional)
        if (!name || !brand || !price || !description || !image || !category || !stock) {
            return res.status(400).json({ message: "Please fill in all required fields." });
        }

        // Check if product with same name already exists
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: "Product already exists." });
        }

        // Create new product
        const newProduct = new Product({
            name,
            brand,
            price,
            description,
            image,
            category,
            stock,
            rating: rating || 0,
            user: token.userId
        });

        await newProduct.save();

        return res.status(201).json({
            message: "Product created successfully",
            product: {
                name: newProduct.name,
                brand: newProduct.brand,
            }
        });

    } catch (error) {
        console.error("Error in addproduct:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getproduct = async (req, res) => {
    try {
        //find using id
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error("Error in getproduct:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    product,
    addproduct,
    getproduct
};

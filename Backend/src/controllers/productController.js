const User = require('../model/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../services/authService');
const Product = require('../model/Product');
const jwt = require('jsonwebtoken');

//Diaplay All Product
const product = async (req, res) => {
    try {
        const products = await Product.find({});
        console.log(products);
        //return
        return res.status(200).json({
            message: 'All Product',
            product: products,
        });
    } catch (error) {
        console.log(error);
    }
};

//Add One Product
const addproduct = async (req, res) => {
    try {
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

        if (!name || !brand || !price || !description || !image || !category || !stock) {
            return res.status(400).json({ message: 'Please fill in all required fields.' });
        }

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product already exists.' });
        }

        // Use userId from req.user set by middleware
        const newProduct = new Product({
            name,
            brand,
            price,
            description,
            image,
            category,
            stock,
            rating: rating || 0,
            user: req.user.userId,
        });
        console.log(req.user.userId);
        

        await newProduct.save();

        return res.status(201).json({
            message: 'Product created successfully',
            product: {
                name: newProduct.name,
                brand: newProduct.brand,
            },
        });
    } catch (error) {
        console.error('Error in addproduct:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


//get one product
const getproduct = async (req, res) => {
    try {
        //find using id
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error('Error in getproduct:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

//Delete One product
const deleteproduct = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log(product.user.toString());
        
        if (product.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        await Product.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error in deleteproduct:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


//Delete All Product
const deleteallproduct = async (req, res) => {
    try {
        const products = await Product.deleteMany();
        return res
            .status(200)
            .json({ message: 'All products deleted successfully' });
    } catch (error) {
        console.error('Error in deleteallproduct:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

//Update One Product
const updateproduct = async (req, res) => {
    try {
        const id = req.params.id;

        // Find product first
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the logged-in user owns this product
        if (product.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        // Proceed with update
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error in updateproduct:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    product,
    addproduct,
    getproduct,
    deleteproduct,
    deleteallproduct,
    updateproduct
};

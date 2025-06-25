const express = require('express');
const mongoose = require('mongoose');
const app = express();

const cartSchema = new mongoose.Schema({
    //arrey of product with quntity
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number
            }
        }
    ],


    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

module.exports = mongoose.model('Cart', cartSchema);

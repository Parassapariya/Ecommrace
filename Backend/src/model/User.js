const express = require("express")
const mongoose = require("mongoose")
const app = express()

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    token: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('User', userSchema)
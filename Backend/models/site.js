const mongoose = require('mongoose')
const Addresses = require('./address')

const Schema = mongoose.Schema
const addressSchema = Addresses.schema

const siteSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },

    addresses: [addressSchema],

    status: {
        type: String,
        enum: ["Complete", "Incomplete", "Unavailable"],
        default: "Incomplete"
    }, 
})

module.exports = mongoose.model('Sites', siteSchema)
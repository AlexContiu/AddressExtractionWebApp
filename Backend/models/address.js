const mongoose = require('mongoose')

const Schema = mongoose.Schema

const addressSchema = new Schema({
    country: {
        type: String,
        default: ""
    },
    region: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    postcode: {
        type: String,
        default: ""
    },
    road: {
        type: String,
        default: ""
    },
    road_number: {
        type: String,
        default: ""
    },

    raw_address: {
        type: String,
        default: ""
    }
})

module.exports = mongoose.model('Adresses', addressSchema)
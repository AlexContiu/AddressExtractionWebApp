require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const siteRouter = require('./routes/sites')

// Express app
const app = express()

// Middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path + ' - ' + req.method) // log requests
    next()
})

// Routes
app.use('/api/sites', siteRouter)

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Listen for requests
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`[server.js] Server is up and running on port ${process.env.SERVER_PORT}! DB connection estabilished!`)
        })
    })
    .catch((error) => {
        console.error('[server.js] Failed to connect to DB. ' + error)
    })
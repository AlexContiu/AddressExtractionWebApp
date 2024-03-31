const Sites = require('../models/site')
const importSitesService = require('../services/importSites')
const addressExtractionService = require('../services/addressExtraction')

// GET all sites
const getSites = async (req, res) => {
    const sites = await Sites.find({})

    res.status(200).json(sites)
}

// GET a single site
const getSite = async (req, res) => {
    const { url } = req.params

    const site = await Sites.findOne({ url: url })

    if (!site) {
        return res.status(404).json({ error: 'Could not find the requested site' })
    }

    res.status(200).json(site)
}

// POST a new site
const createSite = async (req, res) => {
    const { url } = req.body

    try {
        const site = await Sites.create({ url })
        res.status(200).json(site)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// DELETE a site
const deleteSite = async (req, res) => {
    const { url } = req.body

    const site = await Sites.findOneAndDelete({ url: url })

    if (!site) {
        return res.status(404).json({ error: 'Could not delete the requested site' })
    }

    res.status(200).json(site)
}

// UPDATE a site
const updateSite = async (req, res) => {
    const { url } = req.body

    const site = await Sites.findByIdAndUpdate({ url: url }, { ...req.body })

    if (!site) {
        return res.status(404).json({ error: 'Could not update the requested site' })
    }

    res.status(200).json(site)
}

const importSites = async (req, res) => {
    try {
        const importedSites = await importSitesService(req.file)

        res.status(200).json({
            message: `Added ${ importedSites.length } sites`
        })
    } catch (error) {
        res.status(200).json({
            message: `Could not import the following sites: ${ error.unsuccessfulImports }`
        })
    }
}

const extractAddress = async (req, res) => {
    const site = await Sites.findOne({ url: req.body.url })

    if (!site) {
        return res.status(404).json({ error: 'Could not find the requested site in the app database' })
    }

    if (site.status === "Complete") {
        return res.status(200).json({
            message: "Data was already collected",
            site: site
        })
    }

    const addressList = await addressExtractionService(req.body)

    if (addressList.length === 0) {
        return res.status(200).json({
            message: "No data was found"
        })
    }

    addressList.forEach(address => site.addresses.push(address))
    site.status = "Complete"
    
    const updatedSite = await site.save()

    if (!updatedSite) {
        return res.status(404).json({ error: 'Could not update the requested site with the address data' })
    }

    res.status(200).send(updatedSite)
}

module.exports = {
    getSites,
    getSite,
    createSite,
    deleteSite,
    updateSite,
    importSites,
    extractAddress
}
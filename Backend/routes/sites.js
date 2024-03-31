const express = require('express')
const router = express.Router()
const multer = require('multer')
const sitesController = require('../controllers/sites')

const upload = multer({ dest: 'temp/' })

// CRUD Functions
router.get('/', sitesController.getSites) // GET all sites
router.get('/:url', sitesController.getSite) // GET a single site
router.post('/', sitesController.createSite) // POST a new site
router.delete('/', sitesController.deleteSite) // DELETE a new site
router.patch('/', sitesController.updateSite) // UPDATE a new site

// Services
router.post('/import', upload.single('file'), sitesController.importSites)
router.patch('/extract-address', sitesController.extractAddress)

module.exports = router
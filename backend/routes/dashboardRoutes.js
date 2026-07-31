const {Router} = require('express')
const dashboardController = require('../controllers/dashboardControllers')
const requireAdminAuth = require('../middlewares/requireAdmin')

const router = Router()

requireAdminAuth()
router.get('/overview-data', dashboardController.overview_values)
router.get('/analytics-data', dashboardController.analytics_values)
router.get('/revenue-over-time', dashboardController.rev_ovt)
router.get('/busy-hours', dashboardController.busy_hrs)
router.get('/download-report', dashboardController.download_report)

module.exports = router
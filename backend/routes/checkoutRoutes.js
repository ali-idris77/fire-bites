const {Router} = require('express')
const router = Router()



const checkout = require('../controllers/checkoutController')

router.post('/', checkout)

module.exports = router
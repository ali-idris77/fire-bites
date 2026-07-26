const { Router } = require("express");
const cartControllers = require('../controllers/cartControllers');
const requireAuth = require("../middlewares/requireAuth");

const router = Router()

router.use(requireAuth)
router.post('/create', cartControllers.cart_create)

router.get('/', cartControllers.get_carts)

router.post('/update', cartControllers.update_Cart)

router.post('/delete', cartControllers.delete_Cart)
router.patch('/clear', cartControllers.clear_cart)
module.exports = router; 
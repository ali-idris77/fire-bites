const {Router} = require('express')
const {
    create, get ,get_p, update, deleteOne
} = require('../controllers/orderControllers')
const requireAdminAuth = require('../middlewares/requireAdmin')
const requireAuth = require('../middlewares/requireAuth')

const router = Router()

router.post('/create', create)
router.get('/',requireAdminAuth(), get)
router.get('/pers',requireAuth, get_p)
router.patch('/update/:id', update)
router.delete('/:id', deleteOne)

module.exports = router;
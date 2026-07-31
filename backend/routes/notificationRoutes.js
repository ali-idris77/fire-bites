const {Router} = require('express')
const {
    create, get ,p_get,a_get, m_get, update, deleteOne
} = require('../controllers/notificationController')

const router = Router()

router.post('/create', create)
router.get('/', get)
router.get('/:email', p_get)
router.get('/admin', a_get)
router.get('/mgt', m_get)
router.patch('/update/:id', update)
router.delete('/:id', deleteOne)

module.exports = router;
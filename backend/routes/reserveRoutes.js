const {Router} = require('express');
const reserveController = require('../controllers/reserveController')
const requireAuth = require('../middlewares/requireAuth')
const upload = require('../utils/multer');
const requireAdminAuth = require('../middlewares/requireAdmin');
const router = Router();
// router.use(requireAuth)
//Gets
router.get('/',requireAdminAuth(), reserveController.all_reservations)
//router.get('/personal', pers_jobs)

router.get('/:email',requireAuth, reserveController.pers_reservations)
router.get('/:id',requireAuth, reserveController.one_reservation)
//Posts
router.post('/create', reserveController.post_reservation)
//Patchs
router.patch('/update/:id',requireAdminAuth(), reserveController.patch_reservation)
//Delete
router.delete('/:id',requireAdminAuth(), reserveController.delete_reservation)

module.exports = router
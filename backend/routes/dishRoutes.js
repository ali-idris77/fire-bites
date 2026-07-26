const {Router} = require('express');
const dishController = require('../controllers/dishControllers')
const requireAuth = require('../middlewares/requireAuth')
const upload = require('../utils/multer');
const requireAdminAuth = require('../middlewares/requireAdmin');
const sharpImg = require('../utils/sharp')
const router = Router();
// router.use(requireAuth)
//Gets
router.get('/', dishController.all_dishes)
//router.get('/personal', pers_jobs)

router.get('/:id', dishController.one_dish)
//Posts
router.post('/create',requireAdminAuth(2), upload.single('image'), sharpImg, dishController.post_dish)
//Patchs
router.patch('/update/:id',requireAdminAuth(2), upload.none(), dishController.patch_dish)
router.patch('/update-img/:id',requireAdminAuth(2), upload.single('image'), sharpImg, dishController.upd_dish)
//Delete
router.delete('/:id',requireAdminAuth(2), dishController.delete_dish)

module.exports = router
const {Router} = require('express')
const {signup, login, changePassword, customr_login, customr_signup, google_auth} = require('../controllers/authControllers')
const userController = require('../controllers/usersController')
const { downloadTemplate, uploadUsers } = require('../controllers/bulkUserController')
const requireAdminAuth = require('../middlewares/requireAdmin')
const requireAuth = require('../middlewares/requireAuth')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })
const router = Router()

//POSTS
//signup
router.post('/signup',requireAdminAuth(4), signup)
//login
router.post('/login', login)
//customer
router.post('/customer/signup', customr_signup)
//login
router.post('/customer/login', customr_login)
//google auth
router.post('/google', google_auth)

//GETS
router.get('/users', requireAdminAuth(4), userController.getUsers)
router.get('/profile', requireAdminAuth(),  userController.getProfile)
router.get('/profile-user', requireAuth,  userController.getUserProfile)
//patch
router.patch('/update/:id', requireAdminAuth(4), userController.updateStaff)
router.patch('/profile-update/:id', requireAuth, userController.updateUser)
router.delete('/:id', requireAdminAuth(4), userController.deleteStaff)

router.post('/bulk/download-template', requireAdminAuth(4), downloadTemplate)
router.post('/bulk/upload', requireAdminAuth(4), upload.single('file'), uploadUsers)
router.post('/password', requireAdminAuth(), changePassword)

//verify
router.get('/verify-admin', requireAdminAuth(), (req, res)=>{
    res.status(200).json({valid:true})
})
router.get('/verify', requireAuth, (req, res)=>{
    res.status(200).json({valid:true})
})
module.exports = router
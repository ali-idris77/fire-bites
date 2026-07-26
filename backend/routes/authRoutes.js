const {Router} = require('express')
const {signup, login, customr_login, customr_signup} = require('../controllers/authControllers')
const userController = require('../controllers/usersController')
const requireAdminAuth = require('../middlewares/requireAdmin')
const requireAuth = require('../middlewares/requireAuth')
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


//GETS
router.get('/users', requireAdminAuth(4), userController.getUsers)
router.get('/profile', requireAdminAuth(),  userController.getProfile)
//patch
router.patch('/update/:id', requireAdminAuth(4), userController.updateStaff)
router.delete('/:id', requireAdminAuth(4), userController.deleteStaff)

//verify
router.get('/verify-admin', requireAdminAuth(), (req, res)=>{
    res.status(200).json({valid:true})
})
router.get('/verify', requireAuth, (req, res)=>{
    res.status(200).json({valid:true})
})
module.exports = router
const express = require('express')
const authMiddleware = require ('../../middleware/jwt.js')
const router = express.Router();
const {register, login, logout, current}  =require('../../controllers/users.js')

router.post('/register', register);
router.post('/login', login)
router.get('/logout', authMiddleware, logout)
router.get('/current', authMiddleware, current)

module.exports = router
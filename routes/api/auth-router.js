import express from 'express';
import { validateBody } from '../../decorators/index.js';
import * as userSchema from '../../models/Users.js';
import {authController} from '../../controllers/index.js'

const router = express.Router();

const userRegisterValidation = validateBody(userSchema.registerSchema)
const userLoginValidation = validateBody(userSchema.loginSchema)

router.post('/register', userRegisterValidation, authController.register)

router.post('/login', userLoginValidation, authController.login)


export default router;
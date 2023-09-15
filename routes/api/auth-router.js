import express from 'express';
import { validateBody } from '../../decorators/index.js';
import * as userSchema from '../../models/Users.js';
import {authController} from '../../controllers/index.js'
import { authenticate } from '../../middlewares/index.js';

const router = express.Router();

const userRegisterValidation = validateBody(userSchema.registerSchema)
const userLoginValidation = validateBody(userSchema.loginSchema)
const updateSubscriptionValidation = validateBody(userSchema.updateSubscriptionSchema)

router.post('/register', userRegisterValidation, authController.register)

router.post('/login', userLoginValidation, authController.login)

router.get('/current', authenticate, authController.getCurrent)

router.post('/logout', authenticate, authController.logout)

router.patch(
   '/', authenticate, updateSubscriptionValidation, authController.updateSubscription);



export default router;
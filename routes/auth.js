import { Router } from 'express';
import { check } from 'express-validator';
import { crearUsuario, loginUsuario, revalidarToken } from "../controllers/auth.js";
import { validaCampos } from '../middlewares/validar-campos.js';
import { validaJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.post('/new', [
    check('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3}).withMessage('El nombre debe contener al menos 3 caracteres'),
    check('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email ingresado no es valido'),
    check('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña es mínimo de 6 caracteres')
] , validaCampos , crearUsuario);

router.post('/', [ 
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({min:6}), 
    ], validaCampos , loginUsuario);

//Validar y revalidar token
router.get('/renew', validaJWT, revalidarToken);



export default router
import { response } from "express";
import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import generarJWT from "../helpers/jwt.js";

const crearUsuario = async (req, res = response) => {
    const {email, name, password} = req.body;
    
    try {
        //verificar email que no exista
        const usuario = await Usuario.findOne({ email });

        if(usuario){
           return res.status(400).json({
                ok: false,
                msg: 'usuario ya existe con ese email'
           }); 
        }

        // crear usario con  el modelo
        const dbUser = new Usuario(req.body);

        //encriptar la password mediante hash
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);

        //genera el JWT
        const token = await generarJWT(dbUser.id , name);


        //crear usuario en db
        dbUser.save();
        //GENERAR respuesta exitosa
        return res.status(201).json({
            ok: true,
            uuid: dbUser.id,
            name,
            email,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const loginUsuario = async (req, res = response) => {
    const {email, password} = req.body;

    try {
        const dbUser = await Usuario.findOne({ email });

        if(!dbUser){
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }
        //Confirmar si el password hace match
        const validPassword = bcrypt.compareSync( password, dbUser.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'El password no es valido'
            });
        }

        // Generar JSON WEB TOKEN
        const token = await generarJWT(dbUser.id , dbUser.name);
        //GENERAR respuesta exitosa
        return res.json({
            ok: true,
            uuid: dbUser.id,
            name: dbUser.name,
            email,
            token
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const revalidarToken = async(req, res= response) => {
    
    const dbUser = await Usuario.findById(req.uid);

    const token = await generarJWT(req.uid , dbUser.name);
    return res.json({
        ok: true,
        msg: 'Renew',
        uuid: req.uid,
        name: dbUser.name,
        email: dbUser.email,
        token: token
    });
};

export {crearUsuario, loginUsuario, revalidarToken};

import jwt from "jsonwebtoken";

const generarJWT = ( uid, name, id) => {
    const payload = {uid, name};

    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '24h'
        }, (err, token) => {
            if(err){
                console.log(err);
                reject(err);
            }else{
                resolve (token);
            }
        });
    });
    
}

export default generarJWT;
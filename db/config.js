import Mongoose from "mongoose";

const dbConnection = async () =>{
    try{
        Mongoose.set('strictQuery', false);
        await Mongoose.connect(process.env.BD_CNN);

        console.log('DB Online');
    }catch(error){
        console.log(error);
        throw new Error('Error a la hora de inicializar bd');
    }
}

export {dbConnection};
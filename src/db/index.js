import mongoose from "mongoose"
import { DB_NAME} from "../constants.js";
// require('dotenv').config({ path: './env' })

import dotenv from "dotenv"

dotenv.config({
    path:'./.env'
})

// const connectDB = async () => {
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
//         console.log(connectionInstance.connection.host);
//         console.log(process.env.MONGO_URI);
//         console.log("DB Started Successfully!")
//     } catch (error) {
//         console.error("Error Occurred: ", error);
//         process.exit(1)
//     }
// }

const connectDB = () =>  mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)

.then((connection)=>{
    // console.log(connection.connection.host)
    // console.log(process.env.MONGO_URI);
    console.log("DB Started Successfully!")
})
.catch((err) =>{
    console.log(err)
    process.exit(1)
})

export default connectDB
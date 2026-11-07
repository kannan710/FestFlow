import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {})
        console.log("MongoDb Connected")
    }
    catch(err) {
        console.log("Problem connecting the db", err)
        process.exit(1)
    }
}

export default connectDb
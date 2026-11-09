import mongoose from 'mongoose'


export async function connectToDatabase(){
    const databaseUrl = process.env.DATABASE_URL
    if(!databaseUrl){
        throw new Error("DATABASE_URL is not defined")
    }
    await mongoose.connect(databaseUrl)
    console.log("Successfully connected to Database")
}
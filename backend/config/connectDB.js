import mongoose from 'mongoose';
let isConnected = false;

const connectDatabase = async () => {
    if (isConnected) {
        console.log('MongoDB is already connected');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Successfully connected to MongoDB (${process.env.MONGO_URI})`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

export default connectDatabase;
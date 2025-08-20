import mongoose from 'mongoose';

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Successfully connected to MongoDB (${process.env.MONGO_URI})`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

export default connectDatabase;
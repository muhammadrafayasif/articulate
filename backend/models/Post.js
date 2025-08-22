import mongoose from 'mongoose';

const post = new mongoose.Schema({
  content: { type: String, required: true },
  title: { type: String, required: true },
  posted_by: { type: String, required: true },
}, {timestamps: true})

export default mongoose.model("Post", post);
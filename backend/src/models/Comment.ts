import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  newsId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  newsId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model<IComment>('Comment', commentSchema);
export default Comment; 
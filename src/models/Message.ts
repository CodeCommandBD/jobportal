
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  senderId: string; // User ID or 'admin'
  senderName: string;
  text: string;
  isRead: boolean;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

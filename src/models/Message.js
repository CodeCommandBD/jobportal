
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

export default Message;

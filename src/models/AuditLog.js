
import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adminName: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
    },
    targetType: {
      type: String,
    },
    details: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);

export default AuditLog;

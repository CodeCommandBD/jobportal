import dbConnect from "./db";
import AuditLog from "@/models/AuditLog";

export async function logActivity({
    adminId,
    adminName,
    action,
    targetId,
    targetType,
    details
}) {
    try {
        await dbConnect();
        await AuditLog.create({
            adminId,
            adminName,
            action,
            targetId,
            targetType,
            details
        });
    } catch (error) {
        console.error("Audit Logging Error:", error);
    }
}

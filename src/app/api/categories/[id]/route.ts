
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Category from "@/models/Category";
import { auth } from "@/auth";
import { logActivity } from "@/lib/audit";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await dbConnect();
        const category = await Category.findById(params.id);
        
        if (category) {
            await Category.findByIdAndDelete(params.id);

            await logActivity({
                adminId: session.user?.id || '',
                adminName: session.user?.name || 'Admin',
                action: "Deleted Category",
                targetType: "Category",
                details: `Deleted category: ${category.name}`,
            });
        }
        
        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Delete category error:", error);
        return NextResponse.json({ message: "Failed to delete category" }, { status: 500 });
    }
}

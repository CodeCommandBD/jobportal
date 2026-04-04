import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Official Admin Seed Script (Lightweight Version)
 * Run: node --env-file=.env.local scripts/seed-admin.mjs
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log("\x1b[31m%s\x1b[0m", "❌ Error: MONGODB_URI not found.");
  console.log("\x1b[33m%s\x1b[0m", "👉 Fix: Use 'node --env-file=.env.local scripts/seed-admin.mjs' to run this script.");
  process.exit(1);
}

async function seedAdmin() {
  try {
    console.log("\x1b[36m%s\x1b[0m", "⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    
    // We define a minimal User schema
    const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
        name: String,
        email: { type: String, unique: true },
        password: { type: String, select: false },
        role: String
    }, { timestamps: true }));

    const adminEmail = "admin@gmail.com";
    const adminPass = "admin123456";

    console.log("\x1b[36m%s\x1b[0m", `🔍 Checking for existing admin: ${adminEmail}`);
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log("\x1b[33m%s\x1b[0m", `ℹ️  Admin user already exists. Updating role...`);
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log("\x1b[32m%s\x1b[0m", `✅ Success! Admin is ready.`);
      process.exit(0);
    }

    // Create new Admin
    console.log("\x1b[36m%s\x1b[0m", "🔨 Creating official admin account...");
    const hashedPassword = await bcrypt.hash(adminPass, 10);
    await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });

    console.log("\x1b[32m%s\x1b[0m", `✅ SUCCESS! Official Admin Created.`);
    console.log("\x1b[35m%s\x1b[0m", `-------------------------------------------`);
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Pass: ${adminPass}`);
    console.log("\x1b[35m%s\x1b[0m", `-------------------------------------------`);
    process.exit(0);
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "❌ Error seeding admin:", error.message);
    process.exit(1);
  }
}

seedAdmin();

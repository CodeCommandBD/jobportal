import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

/**
 * CLI Script to promote any user to Admin via their email.
 * This bypasses session issues and works directly at the database level.
 * 
 * Usage: node scripts/make-admin.mjs "user@email.com"
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
const emailToPromote = process.argv[2];

if (!MONGODB_URI) {
  console.error("\x1b[31m%s\x1b[0m", "❌ Error: MONGODB_URI not found in .env.local");
  process.exit(1);
}

if (!emailToPromote) {
  console.error("\x1b[33m%s\x1b[0m", "⚠️  Usage: node scripts/make-admin.mjs \"your-email@example.com\"");
  process.exit(1);
}

async function run() {
  try {
    console.log(`\x1b[36m%s\x1b[0m`, `⏳ Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI);
    
    // We define a minimal schema just for this operation
    const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
        email: String,
        role: String
    }));

    console.log(`\x1b[36m%s\x1b[0m`, `🔍 Searching for user: ${emailToPromote}`);
    const user = await User.findOne({ email: emailToPromote.toLowerCase() });

    if (!user) {
      console.error("\x1b[31m%s\x1b[0m", "❌ Error: User not found. Make sure you have registered the account first.");
      process.exit(1);
    }

    user.role = "admin";
    await user.save();

    console.log("\x1b[32m%s\x1b[0m", `✅ Success! User '${user.email}' is now an ADMIN.`);
    console.log("\x1b[35m%s\x1b[0m", `👉 Action: Restart your browser or Clear Cookies & Re-login to access the Admin Panel.`);
    process.exit(0);
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "❌ Error:", error.message);
    process.exit(1);
  }
}

run();

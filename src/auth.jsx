import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { authConfig } from "./auth.config"

async function getUser(email) {
  await dbConnect()
  try {
    const user = await User.findOne({ email }).select("+password")
    return user
  } catch (error) {
    console.error("Failed to fetch user:", error)
    throw new Error("Failed to fetch user.")
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          
          console.log(`[AUTH] 🔍 Searching for user: ${email.toLowerCase()}`);
          const user = await getUser(email.toLowerCase())
          
          if (!user) {
            console.log(`[AUTH] ❌ User not found in database.`);
            return null
          }
          
          console.log(`[AUTH] 🔑 Verifying password for: ${user.email}`);
          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (passwordsMatch) {
            console.log(`[AUTH] ✅ Login successful!`);
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
            }
          } else {
            console.log(`[AUTH] ❌ Password mismatch.`);
          }
        }

        console.log("[AUTH] ❌ Invalid credentials or validation failed.");
        return null
      },
    }),
  ],
})

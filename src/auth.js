import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { z } from "zod"

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
          const user = await getUser(email)
          if (!user) return null
          
          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (passwordsMatch) {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }

        console.log("Invalid credentials")
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
        if (user) {
            token.role = user.role;
            token.id = user.id;
        }
        if (trigger === "update" && session?.name) {
            token.name = session.name
        }
        return token;
    },
    async session({ session, token }) {
        if (token && session.user) {
            session.user.id = token.id;
            session.user.role = token.role;
        }
        return session;
    }
  },
  pages: {
    signIn: '/signin', 
  },
})

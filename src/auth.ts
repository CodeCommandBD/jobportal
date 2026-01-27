
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { z } from "zod"

async function getUser(email: string) {
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
          
          const passwordsMatch = await bcrypt.compare(password, user.password as string)

          if (passwordsMatch) return user
        }

        console.log("Invalid credentials")
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
        if (user) {
            token.role = (user as any).role;
            token.id = (user as any)._id;
        }
        if (trigger === "update" && session?.name) {
            token.name = session.name
        }
        return token;
    },
    async session({ session, token }) {
        if (token) {
            (session.user as any).id = token.id;
            (session.user as any).role = token.role;
        }
        return session;
    }
  },
  pages: {
    signIn: '/signin', 
  },
})

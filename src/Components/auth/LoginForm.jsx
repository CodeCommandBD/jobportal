"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import Link from "next/link"

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

  export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState("jobseeker")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const handleAutofillAdmin = () => {
    setValue("email", "admin@gmail.com")
    setValue("password", "admin123456")
  }

  async function onSubmit(data) {
    setLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl rounded-[2.5rem] border-blue-100 dark:border-gray-800 overflow-hidden">
      <CardHeader className="bg-blue-50/50 dark:bg-gray-800/50 p-8 border-b border-blue-50 dark:border-gray-700">
        <CardTitle className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Welcome Back</CardTitle>
        <CardDescription className="font-bold text-gray-500 uppercase tracking-widest text-xs">
          Select your role and enter your secure credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        
        {/* Role Selector */}
        <div className="flex p-1.5 bg-gray-100 dark:bg-gray-900 rounded-2xl mb-8">
            {[
                { id: 'jobseeker', label: 'Candidate', color: 'bg-blue-600' },
                { id: 'employer', label: 'Employer', color: 'bg-green-600' },
                { id: 'admin', label: 'Admin', color: 'bg-purple-600' }
            ].map((r) => (
                <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                        role === r.id 
                            ? `${r.color} text-white shadow-lg` 
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                >
                    {r.label}
                </button>
            ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</Label>
            </div>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              className="h-14 rounded-2xl border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 font-bold"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-bold">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Secure Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-14 rounded-2xl border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 font-bold"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500 font-bold">{errors.password.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-red-500 text-center font-bold">{error}</p>}
          <Button type="submit" className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-white dark:text-black hover:bg-gray-800 text-lg font-black uppercase tracking-widest shadow-xl transition-all" disabled={loading}>
            {loading ? "Authenticating..." : `Login as ${role}`}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center p-6 bg-gray-50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            New here?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800 transition-colors">
                Create Account
            </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

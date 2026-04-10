"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import axiosInstance from "@/lib/axios"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import Link from "next/link"

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export default function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const [role, setRole] = useState("jobseeker")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data) {
    setLoading(true)
    setError(null)

    try {
      await axiosInstance.post("/auth/register", { ...data, role })
      router.push("/signin")
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl rounded-[2.5rem] border-purple-100 dark:border-gray-800 overflow-hidden">
      <CardHeader className="bg-purple-50/50 dark:bg-gray-800/50 p-8 border-b border-purple-50 dark:border-gray-700">
        <CardTitle className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Join the Platform</CardTitle>
        <CardDescription className="font-bold text-gray-500 uppercase tracking-widest text-xs">
          Select your role and create your professional account
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        
        {/* Role Selector */}
        <div className="flex p-1.5 bg-gray-100 dark:bg-gray-900 rounded-2xl mb-8">
            {[
                { id: 'jobseeker', label: 'Candidate', color: 'bg-blue-500' },
                { id: 'employer', label: 'Employer', color: 'bg-green-500' },
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              className="h-14 rounded-2xl border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 font-bold"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-bold">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              className="h-14 rounded-2xl border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 font-bold"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-bold">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-14 rounded-2xl border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 font-bold"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500 font-bold">{errors.password.message}</p>
            )}
          </div>

          {role === 'admin' && (
             <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                <p className="text-[10px] font-black text-purple-600 uppercase leading-none mb-1">Developer Mode</p>
                <p className="text-[10px] font-bold text-purple-500 italic">Creating an admin account for platform management.</p>
             </div>
          )}

          {error && <p className="text-sm text-red-500 text-center font-bold">{error}</p>}
          <Button type="submit" className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-white dark:text-black hover:bg-gray-800 text-lg font-black uppercase tracking-widest shadow-xl transition-all" disabled={loading}>
            {loading ? "Processing..." : `Register as ${role}`}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-600 hover:underline">
                Login
            </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

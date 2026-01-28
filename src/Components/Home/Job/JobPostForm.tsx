
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { useSession } from "next-auth/react"

import { useCategoryCounts } from "@/hooks/useCategoryCounts"

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  company: z.string().min(2, "Company must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  jobType: z.enum(['Full Time', 'Part Time', 'Remote', 'Contract', 'Internship']),
  salaryRange: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  urgency: z.enum(['Normal', 'Urgent']),
})

type JobFormValues = z.infer<typeof jobSchema>

export default function JobPostForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const { data: categories = [], isLoading: categoriesLoading } = useCategoryCounts()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
        jobType: 'Full Time',
        urgency: 'Normal',
    }
  })

  async function onSubmit(data: JobFormValues) {
    if (!session) {
        setError("You must be logged in to post a job")
        return
    }

    setLoading(true)
    setError(null)

    try {
      await axiosInstance.post("/jobs", data)
      router.push("/")
      router.refresh()
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg my-10 border-none dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center dark:text-white">Post a New Job</CardTitle>
        <CardDescription className="text-center">Fill in the details to reach thousands of job seekers.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="dark:text-gray-300">Job Title</Label>
              <Input id="title" placeholder="e.g. Senior React Developer" className="dark:bg-gray-800 dark:border-gray-700" {...register("title")} />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="dark:text-gray-300">Company Name</Label>
              <Input id="company" placeholder="e.g. Acme Corp" className="dark:bg-gray-800 dark:border-gray-700" {...register("company")} />
              {errors.company && <p className="text-sm text-red-500">{errors.company.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="dark:text-gray-300">Location</Label>
              <Input id="location" placeholder="e.g. New York, USA" className="dark:bg-gray-800 dark:border-gray-700" {...register("location")} />
              {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="dark:text-gray-300">Category</Label>
              <select 
                id="category"
                {...register("category")}
                className="flex h-10 w-full rounded-md border border-input bg-transparent dark:bg-gray-800 dark:border-gray-700 px-3 py-1 text-base shadow-sm md:text-sm dark:text-white"
                disabled={categoriesLoading}
              >
                <option value="">{categoriesLoading ? "Loading..." : "Select Category"}</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type</Label>
              <select 
                {...register("jobType")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm md:text-sm"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryRange">Salary Range</Label>
              <Input id="salaryRange" placeholder="e.g. $80k - $120k" {...register("salaryRange")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <textarea 
                id="description" 
                rows={4}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm md:text-sm"
                placeholder="Describe the role and requirements..."
                {...register("description")} 
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
              <Label>Urgency</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                    <input type="radio" value="Normal" {...register("urgency")} /> Normal
                </label>
                <label className="flex items-center gap-2">
                    <input type="radio" value="Urgent" {...register("urgency")} /> Urgent
                </label>
              </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
            {loading ? "Posting..." : "Post Job"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

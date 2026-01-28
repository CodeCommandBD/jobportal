"use client"

import { useState } from "react"
import { Share2, Bookmark, Check } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import axiosInstance from "@/lib/axios"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import { useGlobalModal } from "@/context/GlobalModalContext"

interface JobActionsProps {
    jobId: string
    jobTitle: string
    employerId: string
    initialIsSaved?: boolean
    initialHasApplied?: boolean
}

export default function JobActions({ jobId, jobTitle, employerId, initialIsSaved = false, initialHasApplied = false }: JobActionsProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const { openModal } = useGlobalModal()
    
    // State
    const [isSaved, setIsSaved] = useState(initialIsSaved)
    const [hasApplied, setHasApplied] = useState(initialHasApplied)
    const [loading, setLoading] = useState(false)
    const [applying, setApplying] = useState(false)
    
    // Handlers
    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href)
            toast.success("Link copied to clipboard!")
        }
    }

    const handleSave = async () => {
        if (!session) {
            toast.error("Please login to save jobs")
            router.push("/signin")
            return
        }

        setLoading(true)
        try {
            const { data } = await axiosInstance.post("/jobs/save", { jobId })
            setIsSaved(data.isSaved)
            toast.success(data.message)
        } catch (error) {
            console.error(error)
            toast.error("Failed to save job")
        } finally {
            setLoading(false)
        }
    }

    const handleApply = async () => {
        if (!session) {
            toast.error("Please login to apply")
            router.push("/signin")
            return
        }

        openModal({
            title: "Confirm Application",
            message: `Are you sure you want to apply for the position of \n\n**${jobTitle}**?`,
            confirmText: "Yes, Apply",
            onConfirm: async () => {
                setApplying(true)
                try {
                    const { data } = await axiosInstance.post("/applications", {
                        jobId,
                        jobTitle,
                        employerId
                    })
                    toast.success(data.message)
                    setHasApplied(true)
                } catch (err) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    toast.error((err as any).response?.data?.message || "Failed to apply")
                } finally {
                    setApplying(false)
                }
            }
        })
    }

    return (
        <div className="flex flex-col gap-3 w-full md:w-auto">
            <Button 
                size="lg" 
                className={`w-full md:w-auto font-semibold ${hasApplied ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
                onClick={handleApply}
                disabled={applying || hasApplied}
            >
                {applying ? "Applying..." : hasApplied ? "Applied Successfully" : "Apply Now"}
            </Button>
            <div className="flex gap-3">
                <Button 
                    variant="outline" 
                    className={`flex-1 justify-center ${isSaved ? 'text-purple-600 border-purple-200 bg-purple-50' : ''}`}
                    onClick={handleSave}
                    disabled={loading}
                >
                    {isSaved ? (
                         <>
                            <Check className="w-4 h-4 mr-2" /> Saved
                         </>
                    ) : (
                         <>
                            <Bookmark className="w-4 h-4 mr-2" /> Save Job
                         </>
                    )}
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

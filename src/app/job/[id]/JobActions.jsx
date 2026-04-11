"use client"
import { useState } from "react"
import { Share2, Bookmark, Check, X, FileText, CheckCircle2 } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import axiosInstance from "@/lib/axios"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function JobActions({ jobId, jobTitle, employerId, initialIsSaved = false, initialHasApplied = false }) {
    const { data: session } = useSession()
    const router = useRouter()
    
    const [isSaved, setIsSaved] = useState(initialIsSaved)
    const [hasApplied, setHasApplied] = useState(initialHasApplied)
    const [loading, setLoading] = useState(false)
    const [applying, setApplying] = useState(false)
    const [showApplyModal, setShowApplyModal] = useState(false)
    const [coverLetter, setCoverLetter] = useState("")
    
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

    const handleApplyClick = () => {
        if (!session) {
            toast.error("Please login to apply")
            router.push("/signin")
            return
        }
        setShowApplyModal(true)
    }

    const confirmApply = async () => {
        setApplying(true)
        try {
            const { data } = await axiosInstance.post("/applications", {
                jobId,
                jobTitle,
                employerId,
                coverLetter
            })
            toast.success(data.message)
            setHasApplied(true)
            setShowApplyModal(false)
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to apply")
        } finally {
            setApplying(false)
        }
    }

    return (
        <>
            <div className="flex flex-col gap-3 w-full md:w-auto">
                <Button 
                    size="lg" 
                    className={`w-full md:w-auto font-semibold ${hasApplied ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
                    onClick={handleApplyClick}
                    disabled={applying || hasApplied}
                >
                    {hasApplied ? "Applied Successfully" : "Apply Now"}
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

            {/* Application Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 w-full max-w-lg border border-purple-100 dark:border-gray-700 shadow-2xl relative my-8">
                        <button 
                            onClick={() => setShowApplyModal(false)}
                            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 transition-colors"
                        >
                            <X size={16} />
                        </button>
                        
                        <div className="mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1">
                                Apply for Position
                            </h3>
                            <p className="text-sm font-bold text-gray-400">
                                {jobTitle}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                                <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                <p className="text-sm font-bold text-blue-700 dark:text-blue-400">
                                    Your profile details and uploaded resume will be automatically sent to the employer.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                                    Cover Letter <span className="text-gray-300 normal-case font-normal">(Optional)</span>
                                </label>
                                <textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    placeholder="Explain why you are the best fit for this role..."
                                    rows={5}
                                    className="w-full text-sm p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 font-medium resize-none placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex items-center gap-3">
                            <Button 
                                variant="outline" 
                                className="flex-1 h-12 rounded-xl text-gray-500 font-bold"
                                onClick={() => setShowApplyModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black shadow-lg shadow-purple-500/20"
                                onClick={confirmApply}
                                disabled={applying}
                            >
                                {applying ? "Submitting..." : "Submit Application"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

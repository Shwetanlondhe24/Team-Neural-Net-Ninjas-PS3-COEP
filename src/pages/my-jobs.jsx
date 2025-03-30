//done
"use client"

import CreatedApplications from "@/components/created-applications"
import CreatedJobs from "@/components/created-jobs"
import { useUser } from "@clerk/clerk-react"
import { BarLoader } from "react-spinners"
import { Briefcase, FileText } from "lucide-react"

const MyJobs = () => {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <BarLoader width={"50%"} color="#6366f1" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center mb-4">
          {user?.unsafeMetadata?.role === "candidate" ? (
            <FileText className="h-10 w-10 text-indigo-500" />
          ) : (
            <Briefcase className="h-10 w-10 text-indigo-500" />
          )}
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {user?.unsafeMetadata?.role === "candidate" ? "My Applications" : "My Jobs"}
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {user?.unsafeMetadata?.role === "candidate"
            ? "Track and manage all your job applications in one place"
            : "Manage your job postings and review applications from candidates"}
        </p>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
        {user?.unsafeMetadata?.role === "candidate" ? <CreatedApplications /> : <CreatedJobs />}
      </div>
    </div>
  )
}

export default MyJobs


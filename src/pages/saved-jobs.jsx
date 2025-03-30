//done - unsave jobs
"use client"

import { getSavedJobs } from "@/api/apiJobs"
import JobCard from "@/components/job-card"
import useFetch from "@/hooks/use-fetch"
import { useUser } from "@clerk/clerk-react"
import { useEffect } from "react"
import { BarLoader } from "react-spinners"
import { Bookmark } from "lucide-react"

const SavedJobs = () => {
  const { isLoaded } = useUser()

  const { loading: loadingSavedJobs, data: savedJobs, fn: fnSavedJobs } = useFetch(getSavedJobs)

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded])

  if (!isLoaded || loadingSavedJobs) {
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
          <Bookmark className="h-10 w-10 text-indigo-500" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Saved Jobs
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Your collection of bookmarked job opportunities for future reference
        </p>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
        {loadingSavedJobs === false && (
          <div className="mt-4">
            {savedJobs?.length ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedJobs?.map((saved) => {
                  return <JobCard key={saved.id} job={saved?.job} onJobAction={fnSavedJobs} savedInit={true} />
                })}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-12 text-center">
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Saved Jobs</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't saved any jobs yet. Browse jobs and bookmark the ones you're interested in.
                </p>
                <a
                  href="/jobs"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <span>Browse Jobs</span>
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedJobs


"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { State } from "country-state-city"
import { BarLoader } from "react-spinners"
import useFetch from "@/hooks/use-fetch"

import JobCard from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { getCompanies } from "@/api/apiCompanies"
import { getJobs } from "@/api/apiJobs"

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [company_id, setCompany_id] = useState("")

  const { isLoaded } = useUser()

  const { data: companies, fn: fnCompanies } = useFetch(getCompanies)

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  })

  useEffect(() => {
    if (isLoaded) {
      fnCompanies()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded])

  useEffect(() => {
    if (isLoaded) fnJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, company_id, searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const query = formData.get("search-query")
    if (query) setSearchQuery(query)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setCompany_id("")
    setLocation("")
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <BarLoader width={"50%"} color="#6366f1" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Latest Jobs
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find your dream job from our curated list of opportunities
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
          <Input
            type="text"
            placeholder="Search jobs by title..."
            name="search-query"
            className="flex-1 h-12 text-base"
          />
          <Button
            type="submit"
            className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Search
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <div className="w-full sm:w-1/3">
            <Select value={location} onValueChange={(value) => setLocation(value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Filter by Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {State.getStatesOfCountry("IN").map(({ name }) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-1/3">
            <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Filter by Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {companies?.map(({ name, id }) => (
                    <SelectItem key={name} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            className="w-full sm:w-1/3 h-11 border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {loadingJobs && (
        <div className="flex items-center justify-center py-12">
          <BarLoader width={"30%"} color="#6366f1" />
        </div>
      )}

      {loadingJobs === false && (
        <div className="mt-6">
          {jobs?.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Jobs Found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default JobListing


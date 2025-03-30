// done
"use client"

import { getCompanies } from "@/api/apiCompanies"
import { addNewJob } from "@/api/apiJobs"
import AddCompanyDrawer from "@/components/add-company-drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import useFetch from "@/hooks/use-fetch"
import { useUser } from "@clerk/clerk-react"
import { zodResolver } from "@hookform/resolvers/zod"
import MDEditor from "@uiw/react-md-editor"
import { State } from "country-state-city"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Navigate, useNavigate } from "react-router-dom"
import { BarLoader } from "react-spinners"
import { z } from "zod"
import { Card, CardContent } from "@/components/ui/card"

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
})

const PostJob = () => {
  const { user, isLoaded } = useUser()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  })

  const { loading: loadingCreateJob, error: errorCreateJob, data: dataCreateJob, fn: fnCreateJob } = useFetch(addNewJob)

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    })
  }

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs")
  }, [loadingCreateJob, dataCreateJob, navigate])

  const { loading: loadingCompanies, data: companies, fn: fnCompanies } = useFetch(getCompanies)

  useEffect(() => {
    if (isLoaded) {
      fnCompanies()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded])

  if (!isLoaded || loadingCompanies) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <BarLoader width={"50%"} color="#6366f1" />
      </div>
    )
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Post a Job
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">Create a new job listing to find the perfect candidate</p>
      </div>

      <Card className="border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Title</label>
              <Input placeholder="e.g. Senior Frontend Developer" className="h-11" {...register("title")} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Job Description</label>
              <Textarea
                placeholder="Describe the role and responsibilities"
                className="min-h-[120px] resize-y"
                {...register("description")}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Location</label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select location" />
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
                  )}
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Controller
                      name="company_id"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select company">
                              {field.value
                                ? companies?.find((com) => com.id === Number(field.value))?.name
                                : "Select company"}
                            </SelectValue>
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
                      )}
                    />
                  </div>
                  <AddCompanyDrawer fetchCompanies={fnCompanies} />
                </div>
                {errors.company_id && <p className="text-red-500 text-sm">{errors.company_id.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Job Requirements</label>
              <Controller
                name="requirements"
                control={control}
                render={({ field }) => (
                  <MDEditor
                    value={field.value}
                    onChange={field.onChange}
                    preview="edit"
                    className="border border-gray-200 rounded-md"
                  />
                )}
              />
              {errors.requirements && <p className="text-red-500 text-sm">{errors.requirements.message}</p>}
            </div>

            {errorCreateJob?.message && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{errorCreateJob?.message}</div>
            )}

            {loadingCreateJob && (
              <div className="flex justify-center py-2">
                <BarLoader width={"30%"} color="#6366f1" />
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="mt-4 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Post Job
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default PostJob


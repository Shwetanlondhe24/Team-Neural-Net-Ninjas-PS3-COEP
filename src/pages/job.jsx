// done - consistent button styling and description check

import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon, UserIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  const formatDescription = (description) => {
    // Split description into paragraphs or points
    return description?.split('\n').map((para, index) => (
      <p key={index} className="mb-4 text-gray-700">{para.trim()}</p>
    ));
  };

  if (!isLoaded || loadingJob) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader width={"200px"} color="#3B82F6" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="bg-white shadow-lg rounded-lg p-10 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <img 
              src={job?.company?.logo_url} 
              className="h-20 w-20 object-contain rounded-xl" 
              alt={`${job?.company?.name} logo`} 
            />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{job?.title}</h1>
              <p className="text-xl text-gray-600">{job?.company?.name}</p>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-gray-200">
          <div className="flex items-center space-x-3">
            <MapPinIcon className="text-blue-500 h-6 w-6" />
            <span className="text-lg text-gray-700">{job?.location}</span>
          </div>
          <div className="flex items-center space-x-3">
            <UserIcon className="text-green-500 h-6 w-6" />
            <span className="text-lg text-gray-700">
              {job?.applications?.length} Applicants
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {job?.isOpen ? (
              <>
                <DoorOpen className="text-green-500 h-6 w-6" /> 
                <span className="text-lg text-green-600">Open</span>
              </>
            ) : (
              <>
                <DoorClosed className="text-red-500 h-6 w-6" /> 
                <span className="text-lg text-red-600">Closed</span>
              </>
            )}
          </div>
        </div>

        {/* Hiring Status Control for Recruiter */}
        {job?.recruiter_id === user?.id && (
          <div className="mb-8">
            <Select onValueChange={handleStatusChange}>
              <SelectTrigger 
                className={`w-full ${
                  job?.isOpen 
                    ? "bg-green-50 border-green-300 text-green-800" 
                    : "bg-red-50 border-red-300 text-red-800"
                } rounded-lg p-3`}
              >
                <SelectValue
                  placeholder={
                    "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Job Description */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">About the Job</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            {formatDescription(job?.description)}
          </div>
        </div>

      {/* Requirements */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Are Looking For</h2>
        <div className="prose max-w-none">
          <MDEditor.Markdown 
            source={job?.requirements} 
            className="text-gray-700 bg-gray-50 p-4 rounded-lg" 
          />
        </div>
      </div>

        {/* Apply Job Drawer */}
        {job?.recruiter_id !== user?.id && (
          <div className="mt-8">
            <ApplyJobDrawer
              job={job}
              user={user}
              fetchJob={fnJob}
              applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
            />
          </div>
        )}

        {/* Loading Indicator for Hiring Status */}
        {loadingHiringStatus && <BarLoader width={"100%"} color="#3B82F6" />}

        {/* Applications Section */}
        {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
          <div className="mt-8 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Applications</h2>
            <div className="space-y-4">
              {job?.applications.map((application) => (
                <ApplicationCard 
                  key={application.id} 
                  application={application} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPage;
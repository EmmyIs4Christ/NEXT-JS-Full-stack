import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import JobListing from "@/components/job-listing";
import {
  fetchJobApplicaationsForCandidate,
  fetchJobApplicaationsForRecruiter,
  fetchJobsForCandidateAction,
  fetchJobsForRecruiterAction,
  fetchProfileAction,
  jobMenuBarAction,
} from "../actions";
import { redirect } from "next/navigation";

async function JobPage({searchParams}) {
  const getCookies = await cookies();
  const token = getCookies.get("token")?.value;
  const user = jwt.decode(token, `${process.env.tokenSecret}`);

  const { profileInfo } = await fetchProfileAction(user?.userId);

  if (user && !profileInfo?.role) return redirect("/onboard");

  const jobsMenuBar = await jobMenuBarAction();

  const jobList =
    profileInfo?.role === "recruiter"
      ? await fetchJobsForRecruiterAction(profileInfo?._id)
      : await fetchJobsForCandidateAction(await searchParams);
      const jobApplications =
      profileInfo?.role === "recruiter"
      ? await fetchJobApplicaationsForRecruiter(profileInfo?._id)
      : await fetchJobApplicaationsForCandidate(profileInfo?._id);
      
  return (
    <JobListing
      jobApplications={jobApplications}
      jobList={jobList}
      profileInfo={profileInfo}
      jobsMenuBar={jobsMenuBar}
    />
  );
}

export default JobPage;

import { cookies } from "next/headers"
import jwt from "jsonwebtoken";
import Activity from "@/components/candidate-activity";
import { fetchJobApplicaationsForCandidate, fetchJobsForCandidateAction, jobMenuBarAction } from "../actions";

async function ActivityPage() {
    const getCookies = await cookies()
    const token = getCookies.get('token')?.value || '';
    const user = jwt.decode(token, `${process.env.tokenSecret}`);
    
    // const jobList = await fetchJobsForCandidateAction();
    const jobList = await jobMenuBarAction();
    const jobApplications = await fetchJobApplicaationsForCandidate(user?.userId)
    // console.log(user, jobApplications)

  return <Activity jobList={jobList} user={user} jobApplications={jobApplications} />;
}

export default ActivityPage
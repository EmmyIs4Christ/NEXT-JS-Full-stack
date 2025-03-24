import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { fetchAllJobsApplicaations, fetchJobApplicaationsForCandidate, fetchProfileAction, jobMenuBarAction } from "./actions";
import Link from "next/link";
import { Fragment } from "react";
import HomepageButtonControls from "@/components/home-page-btn-control";
import CandidateJobCard from "@/components/candidate-job-card";
// import Link from "next/link";

async function Home() {
  const getCookies = await cookies();
  const token = getCookies.get("token")?.value || "";
  const user = jwt.decode(token, "TOKEN_ID");
  // console.log(token, user);

  const { profileInfo } = await fetchProfileAction(user?.userId);
  // console.log(profileInfo, 'profileInfo')
  if (user && !profileInfo?.role) return redirect("/onboard");

  const jobList = await jobMenuBarAction();
  const jobApplications = await fetchAllJobsApplicaations();

  return (
    <Fragment>
      <section className="relative w-full h-full min-h-screen pb-10">
        <div className="w-full h-full relative">
          <div className="flex flex-col lg:flex-row gap-10 mt-16">
            <section className="w-full lg:w-[50%] flex flex-col md:px-2 lg:px-0 p-5 lg:p-10">
              <div className="w-full flex justify-start flex-col h-auto lg:pt-7">
                <span className="flex space-x-2">
                  {/* <span className="block w-14 mb-2 dark:border-white border-b-2 border-gray-700"></span> */}
                  <span className="font-medium italic text-lg dark:text-white text-gray-600">
                    ...One Stop Solution to Finding Jobs
                  </span>
                </span>
                <h3 className="text-3xl dark:text-white mt-5 lg:text-7xl text-black font-extrabold">
                  Build your best job community starting from here.
                </h3>
                <div className="w-full mt-6 flex items-center text-white justify-start gap-2">
                  <HomepageButtonControls profileInfo={profileInfo} />
                </div>
              </div>
            </section>
            <section className="relative w-full lg:w-[50%] flex items-center justify-end">
              <div className="border-8 w-full flex items-center justify-center rounded-lg ring-offset-8 shadow-lg border-white">
                <img
                  src="/images/GIHU_JOB.jpg"
                  alt="Hero"
                  className="h-full w-full object-contain overflow-hidden  z-10"
                />
              </div>
            </section>
          </div>
          {/* <section className="w-full lg:w-[50%] flex flex-col mt-8 md:px-2 lg:px-0 p-5 lg:p-10"> */}
          <section className='mt-20'>
            <h2 className="text-xl dark:text-white my-5 lg:text-4xl text-gray-800 font-bold">
              Explore GIHU Jobs
            </h2>
            {jobList && jobList.length > 0 ? 
                  jobList.map((jobItem, idx) =>
                    
                      <CandidateJobCard
                        profileInfo={profileInfo}
                        jobApplications={jobApplications}
                        key={idx}
                        jobItem={jobItem}
                      />) : null}
          </section>
        </div>
      </section>
    </Fragment>
  );
}

export default Home;

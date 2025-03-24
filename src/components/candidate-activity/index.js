"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CommonCard from "../common-card";
import JobIcon from "../job-icon";

function Activity({ jobApplications, jobList, user }) {
  const uniqueStatusArray = [
    ...new Set(jobApplications.map((item) => item.status).flat(1)),
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <Tabs defaultValue="Applied" className="w-full">
        <div className="flex flex-col lg:flex-row items-baseline justify-between border-b pb-6 pt-24">
          <h1 className="text-3xl mb-4 lg:mb-0 lg:text-4xl font-bold tracking-tight text-gray-950">
            Your Activity
          </h1>
          <TabsList className="bg-[#172538]">
            {uniqueStatusArray.map((status, idx) => (
              <TabsTrigger key={idx} value={status}>
                {status}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="pb-24 pt-6">
          <div className="container mx-auto p-0 space-y-8">
            <div className="flex flex-col gap-4">
              {uniqueStatusArray.map((status, idx) => (
                <TabsContent key={idx} value={status}>
                  {jobList
                    .filter(
                      (job) =>
                        jobApplications
                          .filter((app) => !!app.status.includes(status))
                          .filter((app) => app.jobID === job._id).length > 0
                    )
                    .map((filtJob, idx) => (
                      <CommonCard
                        key={idx}
                        title={filtJob?.title}
                        footerContent={
                          <h2 className="text-xl italic">
                            Applied On:{" "}
                            <span className="text-gray-600 font-extrabold">
                              {
                                filtJob.applicants.find(
                                  (app) => app.candidateUserID === user.userId
                                )?.jobAppliedDate
                              }
                            </span>
                          </h2>
                        }
                        icon={<JobIcon />}
                      />
                    ))}
                </TabsContent>
              ))}
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default Activity;

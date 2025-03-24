"use client";

import { createJobApplicationAction } from "@/app/actions";
import CommonCard from "../common-card";
import JobIcon from "../job-icon";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const { Fragment, useState } = require("react");

function CandidateJobCard({ jobItem, profileInfo, jobApplications }) {
  const [showJobDetailsDrawer, setShowJobDetailsDrawer] = useState(false);
  const router = useRouter();

  async function handleJobApplication() {
    if (!profileInfo) {
      return router.push("/sign-in");
    }

    if (profileInfo.role === "recruiter") {
      toast({
        variant: "destructive",
        title: "Can only apply for a job as a Candidate not Recruiter.",
        description: "Please opt for membership to apply for more jobs",
      });
      return;
    }

    if (!profileInfo?.isPremiumUser && jobApplications.length >= 2) {
      setShowJobDetailsDrawer(false);
      toast({
        variant: "destructive",
        title: "You can apply max 2 jobs.",
        description: "Please opt for membership to apply for more jobs",
      });
      return;
    }
    await createJobApplicationAction(
      {
        recruiterUserID: jobItem?.recruiterId,
        name: profileInfo?.name,
        email: profileInfo?.email,
        candidateUserID: profileInfo._id,
        status: ["Applied"],
        jobID: jobItem?._id,
        jobAppliedDate: new Date().toLocaleString(),
      },
      "/job"
    );
    setShowJobDetailsDrawer(false);
  }

  const applied = !profileInfo
    ? false
    : jobApplications.findIndex((jobApp) => jobApp?.jobID === jobItem?._id) >
      -1;

  return (
    <Fragment>
      <Drawer
        open={showJobDetailsDrawer}
        onOpenChange={setShowJobDetailsDrawer}
      >
        <CommonCard
          icon={<JobIcon />}
          title={jobItem?.title}
          description={jobItem?.companyName}
          footerContent={
            <DrawerTrigger>
              <Button className="flex h-11 items-center justify-center px-5">
                View Details
              </Button>
            </DrawerTrigger>
          }
        />
        <DrawerContent className="p-6">
          <DrawerHeader className="px-0">
            <div className="flex justify-between">
              <DrawerTitle className="text-3xl lg:text-4xl font-extrabold text-grey-800">
                {jobItem?.title}
              </DrawerTitle>
              <div className="flex gap-1 lg:gap-3">
                {profileInfo?.role === "recruiter" ? null : (
                  <Button
                    disabled={applied ? true : false}
                    onClick={handleJobApplication}
                    className="disabled:opacity-65 disabled:cursor-not-allowed flex lg:h-11 items-center justify-center px-5"
                  >
                    {profileInfo?.role === "recruiter"
                      ? "Apply"
                      : applied
                      ? "Applied"
                      : "Apply"}
                  </Button>
                )}
                <Button
                  onClick={() => setShowJobDetailsDrawer(false)}
                  className="flex lg:h-11 items-center justify-center px-5"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DrawerHeader>
          <DrawerDescription className="text-xl lg:text-2xl font-medium text-gray-600">
            {jobItem?.description}
            <span className="text-xl ml-4 font-normal text-gray-500">
              {jobItem?.location}
            </span>
          </DrawerDescription>
          <div className="w-[150px] mt-6 flex justify-center items-center h-[40px] bg-black rounded-[4px]">
            <h2 className="text-xl font-bold text-white">
              {jobItem?.type} Time
            </h2>
          </div>
          <h3>Experience: {jobItem?.experience} Year</h3>
          <div className="flex gap-4 mt-6">
            {jobItem?.skills.split(",").map((skill) => (
              <div
                key={skill}
                className="w-[100px] flex justify-center items-center h-[35px] bg-black rounded-[4px]"
              >
                <h2 className="text-[13px] font-medium text-white">{skill}</h2>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
}

export default CandidateJobCard;

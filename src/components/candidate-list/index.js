"use client";

import { Fragment } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import {
  getCandidateDetailsByIDAction,
  updateJobApplicationAction,
} from "@/app/actions";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DialogTitle } from "@radix-ui/react-dialog";

function CandidateList({
  jobApplications,
  currentCandidateDetails,
  setCurrentCandidateDetails,
  showCurrentCandidateDetailsModal,
  setShowCurrentCandidateDetailsModal,
}) {
  async function hanldeGetCandidateDetails(id) {
    const data = await getCandidateDetailsByIDAction(id);

    if (data) {
      setCurrentCandidateDetails(data);
      setShowCurrentCandidateDetailsModal(true);
    }
  }

  async function handleUpdateJobStatus(newStatus) {
    const copyJobApps = [...jobApplications];
    const indexOfJobApp = copyJobApps.findIndex(
      (item) => item?.candidateUserID === currentCandidateDetails?._id
    );
    const updatedApp = {
      ...copyJobApps[indexOfJobApp],
      status: copyJobApps[indexOfJobApp].status.concat(newStatus),
    };
    await updateJobApplicationAction(updatedApp, "/job");
  }

  const selected = jobApplications
    .find((item) => item?.candidateUserID === currentCandidateDetails?._id)
    ?.status?.includes("Selected");
  const rejected = jobApplications
    .find((item) => item?.candidateUserID === currentCandidateDetails?._id)
    ?.status?.includes("Rejected");

  return (
    <Fragment>
      <div className="grid grid-cols-1 gap-3 p-10 md:grid-cols-2 lg:grid-cols-3">
        {
          //   <div className="grid grid-cols-1 gap-3 p-10 md:grid-cols-2 lg:grid-cols-3">
          jobApplications && jobApplications.length > 0
            ? jobApplications.map((jobApplicantItem, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow-lg w-full max-w-sm rounded-lg overflow-hidden mx-auto mt-4"
                >
                  <div className="px-4 my-6 flex justify-between items-center">
                    <h3 className="text-lg font-bold dark:text-black">
                      {jobApplicantItem?.name}
                    </h3>
                    <Button
                      onClick={() =>
                        hanldeGetCandidateDetails(
                          jobApplicantItem?.candidateUserID
                        )
                      }
                      className="dark:bg-[#fffa27]  flex h-11 items-center justify-center px-5"
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              ))
            : null
          //   </div>
        }
      </div>
      <Dialog
        open={showCurrentCandidateDetailsModal}
        onOpenChange={() => {
          setCurrentCandidateDetails(null);
          setShowCurrentCandidateDetailsModal(false);
        }}
      >
        <DialogContent>
          <DialogTitle>
            <div>
              <h1 className="text-2xl font-bold dark:text-white text-black">
                Name: {currentCandidateDetails?.name} <br />
                Email: {currentCandidateDetails?.email}
              </h1>
              <p className="text-xl font-medium dark:text-white text-black">
                {currentCandidateDetails?.candidateInfo?.currentCompany}
              </p>
              <p className="text-sm font-normal dark:text-white text-black">
                {currentCandidateDetails?.candidateInfo?.currentJobLocation}
              </p>
              <p className="dark:text-white">
                Total Experience:
                {currentCandidateDetails?.candidateInfo?.totalExperience} Years
              </p>
              <p className="dark:text-white">
                Salary: {currentCandidateDetails?.candidateInfo?.currentSalary}{" "}
                LPA
              </p>
              <p className="dark:text-white">
                Notice Period:{" "}
                {currentCandidateDetails?.candidateInfo?.noticePeriod} Days
              </p>
              <div className="flex items-center gap-4 mt-6">
                <h1 className="dark:text-white">Previous Companies</h1>
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  {currentCandidateDetails?.candidateInfo?.previousCompany
                    .split(",")
                    .map((skillItem) => (
                      <div
                        key={skillItem}
                        className="w-[100px] dark:bg-white flex justify-center items-center h-[35px] bg-black rounded-[4px]"
                      >
                        <h2 className="text-[13px]  dark:text-black font-medium text-white">
                          {skillItem}
                        </h2>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-6">
                {currentCandidateDetails?.candidateInfo?.skills
                  .split(",")
                  .map((skillItem) => (
                    <div
                      key={skillItem}
                      className="w-[100px] dark:bg-white flex justify-center items-center h-[35px] bg-black rounded-[4px]"
                    >
                      <h2 className="text-[13px] dark:text-black font-medium text-white">
                        {skillItem}
                      </h2>
                    </div>
                  ))}
              </div>
            </div>
          </DialogTitle>
          <div className="flex gap-3">
            <Link
              href={`${currentCandidateDetails?.candidateInfo?.resume}`}
              target="_blank"
            >
              <Button className="flex px-5 h-11 items-center justify-center ">
                Resume
              </Button>
            </Link>
            <Button
              disabled={rejected || selected}
              onClick={() => handleUpdateJobStatus("Selected")}
              className="flex h-11 items-center justify-center px-5"
            >
              {selected ? "Selected" : "Select"}
            </Button>
            <Button
              disabled={rejected || selected}
              onClick={() => handleUpdateJobStatus("Rejected")}
              className="flex h-11 items-center justify-center px-5"
            >
              {rejected ? "Rejected" : "Reject"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default CandidateList;

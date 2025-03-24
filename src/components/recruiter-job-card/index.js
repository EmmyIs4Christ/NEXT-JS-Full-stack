"use client";

import { useState } from "react";
import CommonCard from "../common-card";
import JobIcon from "../job-icon";
import { Button } from "../ui/button";
import JobApplicants from "../job-applicants";

function RecruiterJobCard({ jobItem, jobApplications, profileInfo }) {
  const [showApplicantsDrawer, setShowApplicantsDrawer] = useState(false);
  const [currentCandidateDetails, setCurrentCandidateDetails] = useState(null);
  const [showCurrentCandidateDetailsModal, setShowCurrentCandidateDetailsModal] =
    useState(false);

  const totalApplication = jobApplications.filter(
    (item) => item?.jobID === jobItem?._id
  ).length;

  return (
    <div>
      <CommonCard
        icon={<JobIcon />}
        title={jobItem?.title}
        footerContent={
          <Button disabled={totalApplication === 0} onClick={()=>setShowApplicantsDrawer(true)} className="disabled:opacity-55 flex h-11 items-center justify-center px-5">
            {totalApplication}{" "}
            {totalApplication > 1 ? "Applicants" : "Applicant"}
          </Button>
        }
      />
      <JobApplicants
        showApplicantsDrawer={showApplicantsDrawer}
        setShowApplicantsDrawer={setShowApplicantsDrawer}
        showCurrentCandidateDetailsModal={showCurrentCandidateDetailsModal}
        setShowCurrentCandidateDetailsModal={setShowCurrentCandidateDetailsModal}
        currentCandidateDetails={currentCandidateDetails}
        setCurrentCandidateDetails={setCurrentCandidateDetails}
        jobItem={jobItem}
        jobApplications={jobApplications.filter(item => item?.jobID === jobItem?._id)}
        
      />
    </div>
  );
}

export default RecruiterJobCard;

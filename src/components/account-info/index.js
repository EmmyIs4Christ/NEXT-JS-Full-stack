"use client";

import {
  initialRecruiterFormData,
  initialCandidateAccountFormData,
  recruiterOnboardFormControls,
  candidateOnboardFormControls,
} from "@/utils";
import { useEffect, useState } from "react";
import CommonForm from "../common-form";
import { updateProfileAction } from "@/app/actions";
import Image from "next/image";
import { User2Icon } from "lucide-react";

function AccountInfo({ profileInfo }) {
  const [candidateFormData, setCandidateFormData] = useState(
    initialCandidateAccountFormData
  );
  const [recruiterFormData, setRecruiterFormData] = useState(
    initialRecruiterFormData
  );

  useEffect(() => {
    if (profileInfo?.role === "recruiter")
      setRecruiterFormData(profileInfo?.recruiterInfo);

    if (profileInfo?.role === "candidate")
      setCandidateFormData(profileInfo?.candidateInfo);
  }, [profileInfo]);
  // console.log(profileInfo);

  async function handleUpdateAccount() {
    const data =
      profileInfo?.role === "candidate"
        ? {
            id: profileInfo?._id,
            email: profileInfo?.email,
            role: profileInfo?.role,
            isPremiumUser: profileInfo?.isPremiumUser,
            memberShipType: profileInfo?.memberShipType,
            memberShipStartDate: profileInfo?.memberShipStartDate,
            memberShipEndDate: profileInfo?.memberShipEndDate,
            candidateInfo: {
              ...candidateFormData,
              resume: profileInfo?.candidateInfo?.resume,
            },
          }
        : {
            id: profileInfo?._id,
            email: profileInfo?.email,
            role: profileInfo?.role,
            isPremiumUser: profileInfo?.isPremiumUser,
            memberShipType: profileInfo?.memberShipType,
            memberShipStartDate: profileInfo?.memberShipStartDate,
            memberShipEndDate: profileInfo?.memberShipEndDate,
            recruiterInfo: {
              ...recruiterFormData,
            },
          };
    await updateProfileAction(data, "/account");
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-baseline dark:border-white justify-between pb-6 border-b pt-24">
        <h1 className="text-4xl font-bold dark:text-white tracking-tight text-gray-950">
          Account Details
        </h1>
      </div>
      <p className="text-2xl md:text-3xl text-center my-2 font-bold">
        Welcome {profileInfo?.name}
      </p>
      <div className="py-20 pb-24 pt-6">
        <div className="w-[200px] h-[200px] mx-auto border-4 rounded-xl">
          <User2Icon className="w-full h-full text-white" />
        </div>
        <div className="container mx-auto p-0 space-y-8">
          <CommonForm
            action={handleUpdateAccount}
            formControls={
              profileInfo?.role === "candidate"
                ? candidateOnboardFormControls.filter(
                    (formControl) => formControl.name !== "resume"
                  )
                : recruiterOnboardFormControls
            }
            formData={
              profileInfo?.role === "candidate"
                ? candidateFormData
                : recruiterFormData
            }
            setFormData={
              profileInfo?.role === "candidate"
                ? setCandidateFormData
                : setRecruiterFormData
            }
            buttonText="Update Profile"
          />
        </div>
      </div>
    </div>
  );
}

export default AccountInfo;

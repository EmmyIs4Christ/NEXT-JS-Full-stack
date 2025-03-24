"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CommonForm from "../common-form";
import {
  candidateOnboardFormControls,
  initialCandidateFormData,
  initialRecruiterFormData,
  recruiterOnboardFormControls,
} from "@/utils";
import { createProfileAction, uploadFileAction } from "@/app/actions";

function Onboard({ user }) {
  const [currentTab, setCurrentTab] = useState("candidate");
  const [recruiterFormData, setRecruiterFormData] = useState(
    initialRecruiterFormData
  );
  const [candidateFormData, setCandidateFormData] = useState(
    initialCandidateFormData
  );
  const [file, setFile] = useState(null);

  function handleTabChange(value) {
    setCurrentTab(value);
  }

  //   function handleForValidity() {
  //     return (
  //       recruiterFormData &&
  //       recruiterFormData.companyName.trim() !== "" &&
  //       recruiterFormData.companyRole.trim() !== "" &&
  //       recruiterFormData.name.trim() !== ""
  //     );
  //   }

  const recruiterFormIsValid = () => {
    return (
      recruiterFormData &&
      recruiterFormData.companyName.trim() !== "" &&
      recruiterFormData.companyRole.trim() !== "" &&
      recruiterFormData.userName.trim() !== ""
    );
  };

  async function submitFormHandler() {
    const data =
      currentTab === "recruiter"
        ? {
            recruiterInfo: recruiterFormData,
            role: "recruiter",
            isPremiumUser: false,
            userId: user?.userId,
          }
        : {
            candidateInfo: candidateFormData,
            role: "candidate",
            isPremiumUser: false,
            userId: user?.userId,
          };
    const result = await createProfileAction(data, "/onboard");
    console.log(result);
  }

  function fileChangeHandler(event) {
    event.preventDefault();
    setFile(event.target.files[0]);
  }

  async function fileSaver() {
    // Create FormData to send the file to the server
    const formData = new FormData();
    formData.append("file", file);

    // Call the server action to upload the file
    try {
      const res = await uploadFileAction(formData);

      if (res.success) {
        setCandidateFormData({ ...candidateFormData, resume: res.path });
        // console.log("success", res.path);
      } else {
        console.log("failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  useEffect(() => {
    if (file) fileSaver();
  }, [file]);

  function candidateFormIsValid() {
    return Object.keys(candidateFormData).every(
      (key) => candidateFormData[key].trim() !== ""
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-xl">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <div className="w-full">
          <div className="flex flex-col lg:flex-row items-baseline justify-between border-b pb-6 pt-24">
            <h1 className="text-2xl my-4 lg:my-0 md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              Welcome to onboard page
            </h1>
            <TabsList className="bg-slate-700 transition-all duration-300">
              <TabsTrigger value="candidate">Candidate</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent
          className="p-5 rounded-sm"
          style={{ backgroundImage: 'url("/images/background img.jpg")' }}
          value="candidate"
        >
          <CommonForm
            formControls={candidateOnboardFormControls}
            buttonText={"Onboard as Cadidate"}
            formData={candidateFormData}
            setFormData={setCandidateFormData}
            handleFileChange={fileChangeHandler}
            btnIsDisabled={!candidateFormIsValid()}
            action={submitFormHandler}
          />
        </TabsContent>
        <TabsContent value="recruiter">
          <CommonForm
            formControls={recruiterOnboardFormControls}
            buttonText={"Onboard as a Recruiter"}
            formData={recruiterFormData}
            setFormData={setRecruiterFormData}
            btnIsDisabled={!recruiterFormIsValid()}
            action={submitFormHandler}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Onboard;

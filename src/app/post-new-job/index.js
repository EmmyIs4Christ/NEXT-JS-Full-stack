"use client";

import CommonForm from "@/components/common-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { initialPostNewJobFormData, postNewJobFormControls } from "@/utils";
import { useState } from "react";
import { postNewJobAction } from "../actions";
import { toast } from "@/hooks/use-toast";

function PostNewJob({ profileInfo, jobList }) {
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [jobFormData, setJobFormData] = useState(initialPostNewJobFormData);

  function handleFormValidity() {
    return Object.keys(jobFormData).every((key) => jobFormData[key] !== "");
  }

  async function handleNewJobPosting() {
    await postNewJobAction(
      { ...jobFormData, recruiterId: profileInfo?._id, applicants: [] },
      "/job"
    );
    setJobFormData(initialPostNewJobFormData);
    setShowJobDialog(false);
  }

  function handlePostJob() {
    if (!profileInfo?.isPremiumUser && jobList.length >= 2) {
      toast({
        variant: "destructive",
        title: "You can post max 2 jobs.",
        description: "Please opt for membership to post more jobs",
      });
      return;
    }
    setShowJobDialog(true);
  }

  return (
    <div>
      <Button
        onClick={() => handlePostJob()}
        className="disabled:opacity-60 flex h-11 items-center justify-center px-5"
      >
        Post A Job
      </Button>
      <Dialog
        open={showJobDialog}
        onOpenChange={() => {
          setShowJobDialog(false);
          setJobFormData(initialPostNewJobFormData);
        }}
      >
        <DialogContent className="sm:max-w-sm md:max-w-md h-[600px] overflow-auto">
          <DialogHeader>
            <DialogTitle>Post New Job</DialogTitle>
            <div className="grid gap-4 py-4">
              <CommonForm
                formControls={postNewJobFormControls}
                buttonText={"Add"}
                formData={{
                  ...jobFormData,
                  companyName: profileInfo?.recruiterInfo?.companyName,
                }}
                setFormData={setJobFormData}
                btnIsDisabled={!handleFormValidity()}
                action={handleNewJobPosting}
              />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PostNewJob;

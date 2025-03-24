"use client";

import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import { Button } from "../ui/button";

function HomepageButtonControls({ profileInfo }) {
  const router = useRouter();

  // console.log(profileInfo);

  return (
    <div className="flex space-x-4">
      <Button
        onClick={() => router.push("/jobs")}
        className="flex h-11 items-center justify-center px-5"
      >
        {profileInfo
          ? profileInfo?.role === "candidate"
            ? "Browse Jobs"
            : "Jobs Dashboard"
          : "Find Job"}
      </Button>
      <Button
        onClick={() =>
          router.push(
            profileInfo
              ? profileInfo?.role === "candidate"
                ? "/activity"
                : "/jobs"
              : "/jobs"
          )
        }
        className="flex h-11 items-center justify-center px-5"
      >
        {profileInfo
          ? profileInfo?.role === "candidate"
            ? "Recent Activities"
            : "Post New Job"
          : "Post Job"}
      </Button>
    </div>
  );
}

export default HomepageButtonControls;

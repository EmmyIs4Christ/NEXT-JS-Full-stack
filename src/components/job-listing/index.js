"use client";

import PostNewJob from "@/app/post-new-job";
import RecruiterJobCard from "../recruiter-job-card";
import CandidateJobCard from "../candidate-job-card";
import { filterMenuDataArray, formUrlQuery } from "@/utils";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { Check, FilterIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function JobListing({ profileInfo, jobsMenuBar, jobList, jobApplications }) {
  const [filterParams, setFilterParams] = useState({});
  const searchParams = useSearchParams();
  const router = useRouter();

  const filterMenus = filterMenuDataArray.map((item) => ({
    id: item.id,
    name: item.label,
    options: [...new Set(jobsMenuBar.map((job) => job[item.id]))],
  }));
  // console.log(filterMenus);

  // function handleFilter(currentSectionId, currentOption) {
  //   let copyFilterParams = { ...filterParams };
  //   const indexOfCurrentSection =
  //     Object.keys(copyFilterParams).indexOf(currentSectionId);

  //   if (indexOfCurrentSection === -1) {
  //     copyFilterParams = {
  //       ...copyFilterParams,
  //       [currentSectionId]: [currentOption],
  //     };
  //   } else {
  //     let indexOfCurrentOption =
  //       copyFilterParams[currentSectionId].indexOf(currentOption);
  //     if (indexOfCurrentOption === -1) {
  //       copyFilterParams[currentSectionId].push(currentOption);
  //     } else copyFilterParams[currentSectionId].splice(indexOfCurrentOption, 1);
  //   }

  //   setFilterParams(copyFilterParams);
  //   sessionStorage.setItem("filterParams", JSON.stringify(copyFilterParams));
  // }

  function handleFilter(getSectionID, getCurrentOption) {
    let cpyFilterParams = { ...filterParams };
    const indexOfCurrentSection =
      Object.keys(cpyFilterParams).indexOf(getSectionID);
    if (indexOfCurrentSection === -1) {
      cpyFilterParams = {
        ...cpyFilterParams,
        [getSectionID]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilterParams[getSectionID].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1)
        cpyFilterParams[getSectionID].push(getCurrentOption);
      else cpyFilterParams[getSectionID].splice(indexOfCurrentOption, 1);
    }
    setFilterParams(cpyFilterParams);
    sessionStorage.setItem("filterParams", JSON.stringify(cpyFilterParams));
  }

  useEffect(() => {
    setFilterParams(JSON.parse(sessionStorage.getItem('filterParams')))
    
  }, []);

  useEffect(() => {
 if (filterParams && Object.keys(filterParams).length > 0) {
   let url = "";
   url = formUrlQuery({
     params: searchParams.toString(),
     dataToAdd: filterParams,
   });

   router.push(url, { scroll: false });
 }
  }, [filterParams, searchParams])

  // console.log(filterParams);
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row items-center justify-between border-gray-200 pb-6 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8 md:mb-0">
          {profileInfo?.role === "candidate"
            ? "Explore All Jobs"
            : "Jobs Dashboard"}
        </h1>
        <div className="flex items-center">
          {profileInfo?.role === "candidate" && <FilterIcon />}
          {profileInfo?.role === "candidate" ? (
            <Menubar >
              {filterMenus.map((filterItem) => (
                <MenubarMenu key={filterItem.name}>
                  <MenubarTrigger >
                    {filterItem.name}
                  </MenubarTrigger>
                  <MenubarContent>
                    {filterItem.options.map((option, idx) => (
                      <MenubarItem
                        className="flex items-center"
                        onClick={() => handleFilter(filterItem.id, option)}
                        key={idx}
                      >
                        <div
                          className={`h-5 w-5 flex items-center justify-center dark:border-white border rounded border-gray-600 `}
                        >
                          {filterParams &&
                          Object.keys(filterParams).length > 0 &&
                          filterParams[filterItem.id] &&
                          filterParams[filterItem.id].indexOf(option) > -1 ? (
                            <Check />
                          ) : null}
                        </div>
                        <Label className="ml-3 dark:text-white cursor-pointer text-sm text-gray-600">
                          {option}
                        </Label>
                      </MenubarItem>
                    ))}
                  </MenubarContent>
                </MenubarMenu>
              ))}
            </Menubar>
          ) : (
            <PostNewJob profileInfo={profileInfo} jobList={jobList} />
          )}
        </div>
      </div>
      <div className="pt-6 pb-24">
        <div className="grid grid-col-1 gap-x-8 gap-y-10 lg:grid-cols-3 ">
          <div className="lg:col-span-4">
            <div className="container mx-auto p-0 space-y-8">
              <div className="grid gap-x-4 grid-cols-1 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                {jobList && jobList.length > 0 ? (
                  jobList.map((jobItem, idx) =>
                    profileInfo?.role === "candidate" ? (
                      <CandidateJobCard
                        profileInfo={profileInfo}
                        jobApplications={jobApplications}
                        key={idx}
                        jobItem={jobItem}
                      />
                    ) : (
                      <RecruiterJobCard
                        profileInfo={profileInfo}
                        jobApplications={jobApplications}
                        key={idx}
                        jobItem={jobItem}
                      />
                    )
                  )
                ) : (
                  <p>No Job Posted</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobListing;

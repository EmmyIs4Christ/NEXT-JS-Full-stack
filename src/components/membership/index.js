"use client";

import { membershipPlans } from "@/utils";
import CommonCard from "../common-card";
import JobIcon from "../job-icon";
import { Button } from "../ui/button";
import { updateProfileAction } from "@/app/actions";

function Membership({ profileInfo }) {
  async function handlePayment(plan) {
    const profile = {
      id: profileInfo?._id,
      isPremiumUser: true,
      membershipType: plan.type,
      membershipStartDate: new Date().toString(),
      membershipEndDate: new Date(
        new Date().getFullYear() + plan.type === "basic"
          ? 1
          : plan.type === "teams"
          ? 2
          : 5,
        new Date().getMonth(),
        new Date().getDay()
      ),
    };
    const update = await updateProfileAction(profile, "/membership");
    console.log(profile, update);
  }
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-baseline dark:border-white justify-between border-b pb-6 pt-24">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold dark:text-white tracking-tight text-gray-950">
          {profileInfo?.isPremiumUser
            ? "You are a premium user"
            : "Choose Your Best Plan"}
        </h1>
        <div className="mr-2 md:mr-0">
          {profileInfo?.isPremiumUser ? (
            <Button className="flex h-11 items-center justify-center px-5">
              {
                membershipPlans.find(
                  (planItem) => planItem.type === profileInfo?.membershipType
                )?.heading
              }
            </Button>
          ) : null}
        </div>
      </div>
      <div className="py-20 pb-24 pt-6">
        <div className="container mx-auto p-0 space-y-8">
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {membershipPlans.map((plan, index) => (
              <CommonCard
                key={index}
                icon={
                  <div className="flex justify-between">
                    <div>
                      <JobIcon />
                    </div>
                    <h1 className="font-bold text-2xl">{plan.heading}</h1>
                  </div>
                }
                title={`$ ${plan.price} /yr`}
                description={plan.type}
                footerContent={
                  profileInfo?.membershipType === "enterprise" ||
                  (profileInfo?.membershipType === "basic" && index === 0) ||
                  (profileInfo?.membershipType === "teams" &&
                  index >= 0 &&
                  index < 2 ? null : (
                    <Button
                      onClick={() => handlePayment(plan)}
                      className="disabled:opacity-65 dark:bg-[#fffa27] flex h-11 items-center justify-center px-5"
                    >
                      {profileInfo?.membershipType === "basic" ||
                      profileInfo?.membershipType === "teams"
                        ? "Update Plan"
                        : "Get Premium"}
                    </Button>
                  ))
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Membership;

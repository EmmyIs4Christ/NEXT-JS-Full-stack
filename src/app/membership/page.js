import React from "react";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Membership from "@/components/membership";
import { fetchProfileAction } from "../actions";
import { redirect } from "next/navigation";

async function MembershipPage() {
  const getCookies = await cookies();
  const token = getCookies.get("token")?.value || "";
  const user = jwt.decode(token, `${process.env.tokenSecret}`);
  // console.log(token, user);

  const { profileInfo } = await fetchProfileAction(user?.userId);
  if (user && !profileInfo?.role) return redirect("/onboard");
  return <Membership profileInfo={profileInfo} />;
}

export default MembershipPage;

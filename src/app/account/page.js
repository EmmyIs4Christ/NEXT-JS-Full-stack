import AccountInfo from "@/components/account-info";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import React from "react";
import { fetchProfileAction } from "../actions";
import { redirect } from "next/navigation";

async function AccountPage() {
  const getCookies = await cookies();
  const token = getCookies.get("token")?.value || "";
  const user = jwt.decode(token, `${process.env.tokenSecret}`);

    const { profileInfo } = await fetchProfileAction(user?.userId);

    if (user && !profileInfo?.role) return redirect("/onboard");
  
  if(!profileInfo) return redirect('onboard')

  return <AccountInfo profileInfo={profileInfo} />;
}

export default AccountPage;

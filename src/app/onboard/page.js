import Onboard from "@/components/onboard";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { fetchProfileAction } from "../actions";
import { redirect } from "next/navigation";

async function OnBoardPage() {
  const getCookies = await cookies();
  const token = getCookies.get("token")?.value || "";
  const user = jwt.decode(token, `${process.env.tokenSecret}`);

  const { profileInfo } = await fetchProfileAction(user?.userId);
  // console.log(profileInfo?.role, !!profileInfo?.role);

  if (!!profileInfo?.role) {
    if (!!profileInfo?.role && !profileInfo?.isPremiumUser) {
      redirect("/membership");
    } else redirect("/");
  } else return <Onboard user={user} />;
}

export default OnBoardPage;

import jwt from "jsonwebtoken";

import Header from "../header";
import { cookies } from "next/headers";
import Footer from "../footer";
import { fetchProfileAction } from "@/app/actions";

async function CommonLayout({ children }) {
  const getCookies = await cookies();
  const token = getCookies.get("token")?.value || "";
  const user = jwt.decode(token, `${process.env.tokenSecret}`);

  const { profileInfo } = await fetchProfileAction(user?.userId);

  return (
    <>
      <div className="mx-auto max-w-7xl p-6 lg:px-8">
        <main className="min-h-[85vh]">
          <Header
            profileInfo={profileInfo}
            user={JSON.parse(JSON.stringify(user))}
          />
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}

export default CommonLayout;

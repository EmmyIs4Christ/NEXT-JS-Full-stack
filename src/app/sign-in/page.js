import SignIn from "@/components/sign-in"
import { cookies } from "next/headers"

async function SignInPage() {
  const getCookies = await cookies();
  const originalUrl = getCookies.get("original-url") || '';
  return (
    <SignIn originalUrl={originalUrl}/>
  );
}

export default SignInPage
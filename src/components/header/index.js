"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import {
  AlignJustify,
  CircleUserRoundIcon,
  LucideDiamondMinus,
} from "lucide-react";
import { LogoutAction } from "@/app/actions";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

function Header({ user, profileInfo }) {
  const router = useRouter();
  const pathname = usePathname()
  const [errorMsg, setErrorMsg] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState({
    mobile: false,
    desktop: false,
  });
  const menuItems = [
    { label: "Home", path: "/", show: true },
    { label: "Register", path: "/sign-up", show: !user },
    { label: "Login", path: "/sign-in", show: !user },
    { label: "Jobs", path: "/jobs", show: user },
    {
      label: "Activity",
      path: "/activity",
      show: profileInfo?.role === "candidate",
    },
    { label: "Membership", path: "/membership", show: user },
    { label: "Account", path: "/account", show: user },
  ];
  const logoutHandler = async () => {
    const response = await LogoutAction();
    if (response.success) {
      setShowLogoutModal({
        mobile: false,
        desktop: false,
      });
      router.push('/sign-in');
    } else {
      setErrorMsg("Failed to log out");
    }
  };
// console.log(pathname,);
const headerTitle = menuItems.filter((item) => item.path === pathname)[0]?.label;

if(user) {
const expirationTime = user?.expires - Date.now();
  setTimeout(() => {
     router.push("/sign-in");
  }, expirationTime)
}

  return (
    <>
      <head>
        <link rel="icon" href="/images/My favicon Ima.ico" />
        <meta name="google-site-verification" content="lSkBVu3gGWgULeCIHToSrDMNRY1nd5y-bOha8V9yWYU" />
        <title>{`GIHU JOBS   ${headerTitle ? "~" + headerTitle : ""}`}</title>
      </head>
      <header className="flex h-16 w-full shrink-0 items-center">
        <Sheet>
          <div className="w-full lg:hidden flex items-center justify-between">
            <SheetTrigger asChild>
              <Button className="lg:hidden">
                <AlignJustify className="h-6 w-6" />
                <span className="sr-only">Toggle Navigation Bar</span>
              </Button>
            </SheetTrigger>
            <Link className="mr-6 flex lg:hidden" href={"#"}>
              <h1 className="font-extrabold text-3xl">GIHU JOBS</h1>
            </Link>
          </div>
          <SheetContent side="left" className="max-w-[250px]">
            <SheetTitle></SheetTitle>
            <div className="grid gap-2 py-6">
              {menuItems.map((menuItem) =>
                menuItem.show ? (
                  <Link
                    key={menuItem.label}
                    href={menuItem.path}
                    className={`flex w-full items-center py-2 text-lg font-bold border-transparent border-b-2 transition-all duration-500 hover:border-b-[blue]
                  ${pathname === menuItem.path ? "border-b-[blue]" : ""} `}
                  >
                    {menuItem.label}
                  </Link>
                ) : null
              )}
              {user && (
                <div className="hover:cursor-pointer relative">
                  <CircleUserRoundIcon
                    onClick={() =>
                      setShowLogoutModal({
                        ...showLogoutModal,
                        mobile: true,
                      })
                    }
                    className="text-[blue] font-bold "
                  />
                  <div
                    className={`rounded-lg w-[250px] h-[200px] border border-slate-300 shadow-lg p-10 bg-slate-200 absolute z-30 top-full ${
                      showLogoutModal.mobile ? "flex flex-col" : "hidden"
                    }`}
                  >
                    <div
                      className={`flex justify-between w-full items-center `}
                    >
                      <CircleUserRoundIcon className="text-[blue] font-bold " />
                      <div
                        className="text-red-600"
                        onClick={() =>
                          setShowLogoutModal({
                            ...showLogoutModal,
                            mobile: false,
                          })
                        }
                      >
                        ⛌
                      </div>
                    </div>
                    <p className="font-bold text-lg">
                      {profileInfo?.candidateInfo?.userName ||
                        profileInfo?.recruiterInfo?.userName}
                    </p>
                    <p className="my-2 italic text-lg">{user?.email}</p>
                    {errorMsg && <p>{errorMsg}</p>}
                    <Button onClick={logoutHandler}>Sign Out</Button>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <div className="hidden lg:flex w-full items-center justify-between">
          <Link className="hidden lg:flex mr-6" href={"/"}>
            <h1 className="font-extrabold text-3xl">GIHU JOBS</h1>
          </Link>
          <nav className="ml-auto hidden lg:flex gap-6">
            {menuItems.map((menuItem) =>
              menuItem.show ? (
                <Link
                  onClick={() => {
                    sessionStorage.removeItem("filterParams");
                  }}
                  key={menuItem.label}
                  href={menuItem.path}
                  className={`group inline-flex w-max text-lg px-4 font-bold border-transparent border-b-2 transition-all duration-500 hover:opacity-100 hover:border-b-white
                  ${
                    pathname === menuItem.path
                      ? "opacity-100 border-b-white"
                      : "opacity-55"
                  } `}
                >
                  {menuItem.label}
                </Link>
              ) : null
            )}
            {user && (
              <div className="flex  justify-center items-center hover:cursor-pointer relative">
                <CircleUserRoundIcon
                  onClick={() =>
                    setShowLogoutModal({
                      ...showLogoutModal,
                      desktop: true,
                    })
                  }
                  className="text-white font-extrabold w-10 h-8 "
                />
                <div
                  className={`rounded-lg border border-slate-300 bg-slate-200 w-[250px] h-[200px] shadow-lg p-10 absolute z-30 top-full right-0 ${
                    showLogoutModal.desktop ? "flex flex-col" : "hidden"
                  }`}
                >
                  <div className={`flex justify-between w-full items-center `}>
                    <CircleUserRoundIcon className="text-[blue] font-bold " />
                    <div
                      className="text-red-600"
                      onClick={() =>
                        setShowLogoutModal({
                          ...showLogoutModal,
                          desktop: false,
                        })
                      }
                    >
                      ⛌
                    </div>
                  </div>
                  <p className="font-bold text-lg">
                    {profileInfo?.candidateInfo?.userName ||
                      profileInfo?.recruiterInfo?.userName}
                  </p>
                  <p className="my-2 italic text-lg">{user?.email}</p>
                  {errorMsg && <p>{errorMsg}</p>}
                  <Button onClick={logoutHandler}>Sign Out</Button>
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function PageNotFound() {
  return (
    <div className="w-full h-full flex items-center justify-center mt-10">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-700">
          404 <br /> Page Not Found!
        </h1>
        <div className="size-[300] overflow-hidden rounded-full my-10">
          <Image
            className="object-contain opacity-55"
            width={300}
            height={300}
            alt="logo"
            src={"/images/logo gihu job.png"}
          />
        </div>
        <Link href={"/"} className="mx-auto w-32 flex items-center">
          <Button className="flex h-11 items-center justify-center px-5">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

'use client';

import { initialSignInFormValue, signInFormTemplate } from "@/utils";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SignInAction } from "@/app/actions";
import { useRouter } from "next/navigation";


function SignIn({ originalUrl }) {
  const [errorMessage, setErrorMessage] = useState(false);
  const [formData, setFormData] = useState(initialSignInFormValue);
  const router = useRouter();
  
  const formIsValid = Object.keys(formData).every(
    (key) => formData[key] !== ""
  );

  // console.log(originalUrl, sessionStorage.getItem(originalUrl.name))
  const submitFormHandler = async () => {
    setErrorMessage(false);
    const resonse = await SignInAction(formData);
    if (!resonse?.success) {
      setErrorMessage(resonse?.message);
    } else {
      setErrorMessage(false);
      console.log(resonse);
      router.replace(
        !!originalUrl?.value && originalUrl?.value !== ""
          ? originalUrl?.value
          : "/"
      );
     }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <p className="italic text-slate-700">
        You can create an account using a dummy email on the sign up page to get
        a better feel of this App
      </p>
      <h2 className="text-3xl font-extrabold text-gray-900">Please Sign In</h2>
      {errorMessage && (
        <div className="bg-red-200 p-5 rounded-md max-w-56 my-10">
          {errorMessage}
        </div>
      )}
      <form
        action={submitFormHandler}
        className=" p-10 my-5 rounded-md shadow-md max-w-lg w-[90%]"
        style={{ backgroundImage: 'url("/images/background img.jpg")' }}
      >
        {signInFormTemplate.map((item) => (
          <div key={item.name}>
            <Label className="font-bold" htmlFor={item.name}>
              {item.label}
            </Label>
            <Input
              className="mb-10"
              value={formData[item.name]}
              name={item.name}
              type={item.type}
              id={item.name}
              onChange={(event) =>
                setFormData({ ...formData, [item.name]: event.target.value })
              }
              placeholder={item.placeholder}
            />
          </div>
        ))}
        <div>
          <Button
            disabled={!formIsValid}
            className="disabled:cursor-not-allowed disabled:opacity-55"
            type="submit"
          >
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SignIn
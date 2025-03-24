"use client";

import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { initialSignUpFormValue, signUpFormTemplate } from "@/utils";
import { SignUpAction } from "@/app/actions";
import { redirect } from "next/navigation";

function SingUp() {
  const [errorMessage, setErrorMessage] = useState(false);
  const [formData, setFormData] = useState(initialSignUpFormValue);

  const formIsValid = Object.keys(formData).every(
    (key) => formData[key] !== ""
  );
  //  console.log(formIsValid, formData);

  const submitFormHandler = async () => {
    const response = await SignUpAction(formData);

    if (!response?.success) {
      setErrorMessage(response?.message);
    } else {
      setErrorMessage(false);
      redirect("/sign-in");
      // console.log(response)
    }
  };
  
  return (
    <div className="flex flex-col items-center mt-20">
      <p className="italic text-slate-700">You can create an account using a dummy email to get a better feel of this App</p>
      <h2 className="text-3xl font-extrabold text-gray-900">Please Register</h2>
      {errorMessage && (
        <div className="bg-red-200 p-5 rounded-md max-w-56 my-10">
          {errorMessage}
        </div>
      )}
      <form
        style={{ backgroundImage: 'url("/images/background img.jpg")' }}
        action={submitFormHandler}
        className="p-10 my-5 rounded-md shadow-md max-w-lg w-[90%]"
      >
        {signUpFormTemplate.map((item) => (
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
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SingUp;

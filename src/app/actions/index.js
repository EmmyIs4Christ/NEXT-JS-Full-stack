"use server";

import Joi from "joi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectToDb from "../../database";
import User from "@/model/user";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import Job from "@/model/job";
import Application from "@/model/application";

const CheckFormData = Joi.object({
  name: Joi.string().trim().not().empty(),
  email: Joi.string().trim().not().empty(),
  password: Joi.string().not().empty(),
});

// SIGN UP ACTION
export async function SignUpAction(formData) {
  const { name, email, password, confirmPassword } = formData;
  // check if the two password matches
  if (password !== confirmPassword) {
    return { success: false, message: "Password must match" };
  }
  // server side form validation
  const { errors } = CheckFormData.validate({
    name,
    email,
    password,
  });

  if (errors) {
    return {
      success: false,
      message: errors.details[0].message,
    };
  }
  try {
    await connectToDb();
    // check email already exists
    const emailExist = await User.findOne({ email: email });
    if (emailExist)
      return {
        success: false,
        message: "Email already exist. Please use a different email",
      };
    //hashing out password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //Enter to database
    const newCandidate = {
      name,
      email,
      password: hashedPassword,
    };
    console.log(newCandidate)
    const user = await User.create(newCandidate);
    const savedUser = await user.save();
    if (savedUser) {
      return {
        success: true,
        message: "Sign In successfull",
      };
    } else {
      return {
        success: false,
        message: "Something went wrong please try again later.",
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Something went wrong please try again later.",
    };
  }
}

// SIGN IN ACTION
export async function SignInAction(formData) {
  const { email, password } = formData;
  //server side form validation
  const { errors } = CheckFormData.validate({ email, password });

  if (errors) return { success: false, message: errors.details[0].message };

  try {
    await connectToDb();
    //confirming credentials on database
    const user = await User.findOne({ email: email });
    if (!user) return { success: false, message: "Incorrect email address" };
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if (!passwordIsCorrect)
      return { success: false, message: "Incorrect password" };

    //creating token an redirecting
    const token = jwt.sign(
      {
        email: user?.email,
        userId: user?._id,
        expires: new Date(Date.now() + 7200000).getTime(),
      },
      `${process.env.tokenSecret}`,
      { expiresIn: "2h" }
    );

    const getCookies = await cookies();
    getCookies.set("token", token, { maxAge: 7200 });
    getCookies.delete("original-url");

    // console.log(token, jwt.verify(token, 'TOKEN_ID'), passwordIsCorrect);
    return { success: true, message: "Loged In" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong. Please try again later",
    };
  }
}

// LOGOUT HANDLER
export async function LogoutAction() {
  const getCookies = await cookies();
  getCookies.set("token", null);
  getCookies.delete("original-url");
  return {
    success: true,
    message: "Log out successfull",
  };
}

// CREATE PROFILE ACTION
export async function createProfileAction(formData, pathToRevalidate) {
  // console.log(formData);
  try {
    await connectToDb();
    const update =
      formData.role === "recruiter"
        ? {
            recruiterInfo: formData?.recruiterInfo,
            isPremiumUser: formData?.isPremiumUser,
            role: formData?.role,
            memberShipType: "none",
            memberShipStartDate: "none",
            memberShipEndDate: "none",
          }
        : {
            memberShipType: "none",
            memberShipStartDate: "none",
            memberShipEndDate: "none",
            candidateInfo: formData?.candidateInfo,
            isPremiumUser: formData?.isPremiumUser,
            role: formData?.role,
          };
    const profile = await User.findByIdAndUpdate(
      { _id: formData?.userId },
      update
    );
    // profile.recruiterInfo = recruiter
    await profile.save();
    const updatedProfile = await User.findById(formData?.userId);
    if (updatedProfile) {
      revalidatePath(pathToRevalidate);
      return {
        success: true,
        profile: JSON.parse(JSON.stringify(updatedProfile)),
        message: "Profile created successfully",
      };
    } else {
      return {
        success: false,
        message: "Something went wrong. Please try again later",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong. Please try again later",
    };
  }
}

// fetching profile info
export async function fetchProfileAction(id) {
  try {
    await connectToDb();
    const userProfile = await User.findById(id);

    if (userProfile) {
      return {
        success: true,
        message: "Found a profile",
        profileInfo: JSON.parse(JSON.stringify(userProfile)),
      };
    } else {
      return {
        success: false,
        message: "No user found",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong. Please try again later",
    };
  }
}

//create job action
export async function postNewJobAction(formData, pathToRevalidate) {
  try {
    await connectToDb();
    await Job.create(formData);
    revalidatePath(pathToRevalidate);
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong. Please try again later",
    };
  }
}

//fetch job actions for candidate and for recruiters
//for recruiter
export async function fetchJobsForRecruiterAction(id) {
  try {
    await connectToDb();
    const jobs = await Job.find({ recruiterId: id });
    return JSON.parse(JSON.stringify(jobs));
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong. Please try again later",
    };
  }
}

export async function fetchJobsForCandidateAction(filterParams = {}) {
  try {
    
    let updatedParams = {};
    Object.keys(filterParams).forEach((filterKey) => {
      updatedParams[filterKey] = { $in: filterParams[filterKey].split(",") };
    });
    //  console.log(updatedParams, "updatedParams");
    const result = await Job.find(
      filterParams && Object.keys(filterParams).length > 0 ? updatedParams : {}
    );

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong. Please try again later",
    };
  }
}

// fetching jobs for menu bar
export async function jobMenuBarAction() {
  try {
    await connectToDb();
    const jobs = await Job.find().populate("applicants").exec();
    return JSON.parse(JSON.stringify(jobs));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify(jobs));
  }
}

// fetching all applications for home page
export async function fetchAllJobsApplicaations(c) {
  try {
    await connectToDb();
    const result = await Application.find();
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error("Error handling the file upload:", error);
    return { success: false };
  }
}

// Server Action to handle file upload
const fs = require("fs");
const path = require("path");
export async function uploadFileAction(formData) {
  try {
    const file = formData.get("file");
    const uploadDir = "public/uploads"; // Path where we will save the file
    const uploadPath = path.join(process.cwd(), uploadDir);
    const dbPath = "/uploads/" + file.name;

    // Ensure the directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Move the file to the server directory
    const filePath = path.join(uploadPath, file.name);
    const fileStream = fs.createWriteStream(filePath);

    // Save the file to the server
    const buffer = Buffer.from(await file.arrayBuffer());
    fileStream.write(buffer);
    fileStream.end();

    return { success: true, path: dbPath };
  } catch (error) {
    console.error("Error handling the file upload:", error);
    return { success: false };
  }
}

// create job application
export async function createJobApplicationAction(data, pathToRevalidate) {
  const { jobID, jobAppliedDate } = data;
  try {
    await connectToDb();
    const job = await Job.findById(jobID);
    const application = await Application.create(data);
    // const application = await new Application(data);
    // await application.save();

    console.log(application, "new app");
    job.applicants.push(application);
    await job.save();
    revalidatePath(pathToRevalidate);
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

// fetch job application for candidate
export async function fetchJobApplicaationsForCandidate(candidateId) {
  try {
    await connectToDb();
    const result = await Application.find({ candidateUserID: candidateId });
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error("Error handling the file upload:", error);
    return { success: false };
  }
}

// fetch job applicaion for recruiter

export async function fetchJobApplicaationsForRecruiter(recruiterId) {
  try {
    await connectToDb();
    const result = await Application.find({ recruiterUserID: recruiterId });
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error("Error handling the file upload:", error);
    return { success: false };
  }
}

// get candidate details by ID
export async function getCandidateDetailsByIDAction(id) {
  try {
    await connectToDb();
    const result = await User.findById(id);
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error("Error handling the file upload:", error);
    return { success: false };
  }
}

// update job applications
export async function updateJobApplicationAction(data, pathToRevalidate) {
  try {
    await connectToDb();
    const {
      recruiterUserID,
      name,
      email,
      candidateUserID,
      status,
      jobID,
      _id,
      jobAppliedDate,
    } = data;
    await Application.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        recruiterUserID,
        name,
        email,
        candidateUserID,
        status,
        jobID,
        jobAppliedDate,
      },
      { new: true }
    );
    revalidatePath(pathToRevalidate);
  } catch (error) {
    console.error("Error handling the file upload:", error);
    return { success: false };
  }
}

//update profile action
export async function updateProfileAction(data, pathToRevalidate) {
  try {
    await connectToDb();
    const {
      role,
      email,
      isPremiumUser,
      membershipType,
      membershipStartDate,
      membershipEndDate,
      recruiterInfo,
      candidateInfo,
      id,
    } = data;

    const update = await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        role,
        email,
        isPremiumUser,
        membershipType,
        membershipStartDate,
        membershipEndDate,
        recruiterInfo,
        candidateInfo,
      },
      { new: true }
    );
    revalidatePath(pathToRevalidate);
    return JSON.parse(JSON.stringify(update));
    
  } catch (error) {
    console.error("Error handling the file upload:", error);
    return { success: false };
  }
}

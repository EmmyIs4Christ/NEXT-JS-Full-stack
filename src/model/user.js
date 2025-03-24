import mongoose from "mongoose";

const JobscoSchema = new mongoose.Schema({
  membershipStartDate: String,
  membershipEndDate: String,
  membershipType: String,
  password: String,
  name: String,
  isPremiumUser: Boolean,
  email: String,
  role: String,
  // membershipType: { type: String, required: true },
  recruiterInfo: {
    userName: String,
    companyName: String,
    companyRole: String,
  },
  candidateInfo: {
    currentJobLocation: String,
    preferedJobLocation: String,
    currentSalary: String,
    noticePeriod: String,
    skills: String,
    currentCompany: String,
    previousCompany: String,
    totalExperience: String,
    college: String,
    collegeLocation: String,
    linkedInProfile: String,
    githubProfile: String,
    resume: String,
    graduationYear: String,
    userName: String,
  },
});

const User = mongoose.models.User || mongoose.model("User", JobscoSchema);

export default User;

import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  companyName: String,
  title: String,
  location: String,
  type: String,
  experience: String,
  description: String,
  skills: String,
  // applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
  recruiterId: String,
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  ],

  //  applicants: [{ appID: mongoose.Schema.Types.ObjectId, appDate: String }],
});

const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);
export default Job;

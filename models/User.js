const mongoose = require("mongoose");

const userTypes = ["Candidate", "Employer"];
const employmentTypes = [
  "Full-time",
  "Part-time",
  "Self-employed",
  "Freelance",
  "Contract",
  "Internship",
  "Apprenticeship",
  "Seasonal",
];
const subscriptionTypes = ["Free", "Basic", "Premium"];

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    companyName: { type: String },
    dateOfBirth: { type: Date },
    linkedIn: { type: String },
    gitHub: { type: String },
    blog: { type: String },
    role: { type: String },
    skills: { type: [String] },
    portfolio: { type: String },
    biography: { type: String },
    experience: [
      {
        companyName: { type: String },
        jobRole: { type: String },
        employmentType: {
          type: String,
          enum: employmentTypes,
          default: "Full-time",
        },
        location: { type: String },
        startYear: { type: String },
        startMonth: { type: String },
        endYear: { type: String },
        endMonth: { type: String },
        skills: { type: [String] },
        workDone: { type: String },
        currentlyWorking: {
          type: Boolean,
          default: false,
        },
      },
    ],
    education: [
      {
        universityName: { type: String },
        degreeName: { type: String },
        classOfDegree: { type: String },
        startYear: { type: String },
        startMonth: { type: String },
        endYear: { type: String },
        endMonth: { type: String },
        currentlyWorking: {
          type: Boolean,
          default: false,
        },
      },
    ],
    projects: [
      {
        projectName: { type: String },
        projectDomain: { type: String },
        projectOverview: { type: String },
        startYear: { type: String },
        startMonth: { type: String },
        endYear: { type: String },
        endMonth: { type: String },
        skills: { type: [String] },
        contribution: { type: String },
        gitHubLink: { type: String },
        currentlyWorking: {
          type: Boolean,
          default: false,
        },
      },
    ],
    awards: [
      {
        awardName: { type: String },
        organizationName: { type: String },
        placeDescription: { type: String },
        year: { type: String },
        month: { type: String },
      },
    ],
    volunteering: [
      {
        organizationName: { type: String },
        position: { type: String },
        eventName: { type: String },
        startYear: { type: String },
        startMonth: { type: String },
        endYear: { type: String },
        endMonth: { type: String },
      },
    ],
    avatar: { type: String },
    hourly_rate: { type: Number },
    level: { type: String },
    availability: { type: String },
    location: { type: String },
    num_of_connections: { type: Number },
    overview: { type: String },
    userType: {
      type: String,
      enum: userTypes,
      default: "Candidate",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActivated: {
      type: Boolean,
      default: true,
    },
    apply_job_id_list: { type: [String] },
    soft_skills: {
      type: [String],
      default: ["leadership", "communication skills"],
    },
    logo_url: { type: String, default: "" },
    banner_url: { type: String, default: "" },
    subscription_type: {
      type: String,
      enum: subscriptionTypes,
      default: "Free",
    },
    no_of_applications: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

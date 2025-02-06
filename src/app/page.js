"use client";

import { useState, useEffect } from "react";
import Introduction from "./components/Introduction";
import GetStarted from "./components/GetStarted";
import JobDesc from "./components/JobDesc";
import PersonalDesc from "./components/PersonalDesc";
import InformationLoad from "./components/InformationLoad";
import MeetingSelection from "./components/MeetingSelection";
import EquipmentCheck from "./components/EquipmentCheck";
import Interview from "./components/Interview";
import VideoHighlights from "./components/VideoHighlights";
import ReportLoad from "./components/ReportLoad";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    jobLink: "",
    formJobTitle: "",
    formEmployerName: "",
    formEmployerLocation: "",
    formJobDescription: "",
    formEmployerDescription: "",
    resumeName: "Ex. John_Doe.pdf",
    resumeFile: null,
    formFullName: "",
    formPersonalJobTitle: "",
    formDegrees: [],
    formSchools: [],
    formSchoolStartDates: [],
    formSchoolEndDates: [],
    formExperienceJobTitles: [],
    formExperienceStartDates: [],
    formExperienceEndDates: [],
    formExperienceDescriptions: [],
    formExperienceCompanies: [],
    formExperienceLocations: [],
    interviewMode: "",
  });

  const [interviewData, setInterviewData] = useState({
    currentQuestion: "",
    recentVideoRecording: "",
    textReport: "",
    videos: [
      { title: "", summary: "", url: "" },
      { title: "", summary: "", url: "" },
      { title: "", summary: "", url: "" },
    ],
  });

  const API_URL = process.env.API_URL;

  useEffect(() => {
    if (currentStep === 7) {
      fetch(`${API_URL}init_interview_session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          mode: formData.interviewMode,
          custom_job_str: {
            formJobTitle: formData.formJobTitle,
            formEmployerName: formData.formEmployerName,
            formEmployerLocation: formData.formEmployerLocation,
            formJobDescription: formData.formJobDescription,
            formEmployerDescription: formData.formEmployerDescription,
          },
          interviewee_records: {
            ...formData,
          },
          website_url: formData.jobLink,
          session_key: "test",
          interviewee_resume: formData.resumeFile,
        }),
      })
        .then((res) => res.json())
        .then((data) =>
          setInterviewData((prev) => ({
            ...prev,
            currentQuestion: JSON.parse(data.body).summary,
          }))
        )
        .catch((err) => console.error(err));
    }
  }, [currentStep]);

  useEffect(() => {
    if (interviewData.recentVideoRecording) {
      fetch(`${API_URL}get_interview_question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_input: interviewData.recentVideoRecording,
          session_key: "test",
        }),
      })
        .then((res) => res.json())
        .then((data) =>
          setInterviewData((prev) => ({
            ...prev,
            currentQuestion: JSON.parse(data.body).next_question,
          }))
        )
        .catch((err) => console.error(err));
    }
  }, [interviewData.recentVideoRecording]);

  const steps = [
    <Introduction setCurrentStep={setCurrentStep} />,
    <GetStarted setCurrentStep={setCurrentStep} />,
    <JobDesc
      formData={formData}
      setFormData={setFormData}
      setCurrentStep={setCurrentStep}
    />,
    <PersonalDesc
      formData={formData}
      setFormData={setFormData}
      setCurrentStep={setCurrentStep}
    />,
    <MeetingSelection
      formData={formData}
      setFormData={setFormData}
      setCurrentStep={setCurrentStep}
    />,
    <InformationLoad setCurrentStep={setCurrentStep} />,
    <EquipmentCheck setCurrentStep={setCurrentStep} />,
    <Interview
      interviewData={interviewData}
      setInterviewData={setInterviewData}
      setCurrentStep={setCurrentStep}
    />,
    <ReportLoad
      interviewData={interviewData}
      setInterviewData={setInterviewData}
      API_URL={API_URL}
      setCurrentStep={setCurrentStep}
    />,
    <VideoHighlights interviewData={interviewData} />,
  ];

  return <div className="overflow-x-hidden">{steps[currentStep]}</div>;
}

import React, { useState } from "react";
import { useSelector } from "react-redux";
import Input from "../components/Input";
import { addApplication, editApplication, getApplications } from "../api/applicationHandler";

function AddEditApplicationModal({ setIsApplicationModalOpen, type, application = {}, setAppls }) {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [err, setErr] = useState("");

  const boards = useSelector((state) => state.boards).map((board) => ({
    name: board.name,
    id: board._id,
  }));

  const [applicationData, setApplicationData] = useState({
    jobTitle: "",
    companyName: "",
    jobLink: "",
    date: new Date(),
    location: "",
    board: boards[0]?.id,
  });

  if (type === "edit" && isFirstLoad) {
    setApplicationData({
    jobTitle: application.jobTitle,
    companyName: application.companyName,
    jobLink: application.jobLink,
    date: application.date,
    location: application.location,
    board: application.board,
  });
    setIsFirstLoad(false);
  }

  const validate = () => {
    
    if (!applicationData.jobTitle.trim()) {
      setErr("Job Title should not be empty");
      return false;
    }
    if (!applicationData.companyName.trim()) {
      setErr("Company Name should not be empty");
      return false;
    }
    if (!applicationData.jobLink.trim()) {
      setErr("Job Link should not be empty");
      return false;
    }
    if (!applicationData.location.trim()) {
      setErr("Location should not be empty");
      return false;
    }

    if (boards.length === 0) {
      setErr("Create atleast one board before adding application")
      return false
    }

    setErr("");
    return true;
  };

  const onSubmit = (type) => {
    setIsApplicationModalOpen(false);

    if(type === "add") {
      addApplication({applicationData})
    } else {
      editApplication({
        id: application._id, ...applicationData
      })
    }

    setApplicationData({
    jobTitle: "",
    companyName: "",
    jobLink: "",
    date: new Date(),
    location: "",
    board: "",
  });

    getApplications().then(res => setAppls(res)).catch(err => console.log(err)) 
  };

  return (
    <div
      className="fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 left-0 bottom-0 justify-center items-center flex dropdown"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsApplicationModalOpen(false);
      }}
    >
      <div
        className="scrollbar-hide overflow-y-scroll max-h-[95vh] bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
       shadow-md shadow-[#364e7e1a] max-w-md mx-auto my-auto w-full px-8 py-8 rounded-xl"
      >
        <h3 className="text-lg">
          {type === "edit" ? "Edit" : "Add New"} Application
        </h3>
        <br />
        {err !== "" && <p className="text-red-800 dark:text-red-400">{err}</p>}
        {err === "" && <p className="opacity-0">{err}</p>}

        <Input
          label="Job Title"
          value={applicationData.jobTitle}
          onChange={(e) =>
            setApplicationData({ ...applicationData, jobTitle: e.target.value })
          }
          id="job-title-input"
          placeholder="e.g Web Designer"
        />

        <Input
          label="Company Name"
          value={applicationData.companyName}
          onChange={(e) =>
            setApplicationData({
              ...applicationData,
              companyName: e.target.value,
            })
          }
          id="company-name-input"
          placeholder="e.g Apple"
        />

        <Input
          label="Job Link"
          value={applicationData.jobLink}
          onChange={(e) =>
            setApplicationData({ ...applicationData, jobLink: e.target.value })
          }
          id="job-link-input"
          placeholder="e.g https://www.linkedin.com/lorem-ipsum-1814/"
        />

        <Input
          label="Job Location"
          value={applicationData.location}
          onChange={(e) =>
            setApplicationData({
              ...applicationData,
              location: e.target.value,
            })
          }
          id="job-location-input"
          placeholder="e.g California"
        />

        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm dark:text-white text-gray-500">
            Application Deadline
          </label>
          <input
            className="bg-transparent px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
            type="date"
            placeholder={new Date()}
            value={applicationData.date}
            onChange={(e) =>
              setApplicationData({
                ...applicationData,
                date: e.target.value,
              })
            }
            id={"applicate-deadline-input"}
          />
        </div>

        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm dark:text-white text-gray-500">
            Board Name
          </label>
          <select className="bg-transparent px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1 ring-0" defaultValue={application.board !== "" ? application.board : boards[0]?.id}  onChange={(e) => {
            setApplicationData({
                ...applicationData,
                board: e.target.value,
            })
          }}>
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            let isValid = validate();
            if (isValid === true) onSubmit(type);
          }}
          className="w-full items-center hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative text-white bg-[#635fc7] py-2 rounded-full"
        >
          {type === "add" ? "Create New Application" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default AddEditApplicationModal;

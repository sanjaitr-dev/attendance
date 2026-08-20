import { useState, useRef, useEffect } from "react";
import FormField from "../component/FormField";
import { addEmployees, getEmployees, updateEmployee } from "../api/Api";
import Navbar from "../component/Navbar";
import { Link, useParams } from "react-router-dom";
import { getEmployeeById } from "../api/Api";
import { useNavigate } from "react-router-dom";
import {
  RiArrowLeftLine,
  RiUploadCloud2Line,
  RiUserFill,
} from "@remixicon/react";
function EmployeeForm({ mode }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("Please select a department");
  const [designation, setDesignation] = useState("");
  const [doj, setDoj] = useState("");
  const [status, setStatus] = useState("Select Status");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const departmentArray = [
    "Human Resources",
    "Engineering",
    "Marketing",
    "Sales",
    "Finance",
    "Customer Service",
    "Legal",
    "Product Management",
    "Operations",
    "Design",
  ];

  const statusArray = ["Active", "Inactive"];

  const genderArray = ["Male", "Female", "Other"];
  useEffect(() => {
    if (mode !== "add") {
      fetchEmployee();
    }
  }, []);

  const fetchEmployee = async () => {
    const response = await getEmployeeById(id);
    setName(response.data.name);
    setGender(response.data.gender);
    const fullDate = response.data.dob;
    const dateOnly = fullDate ? fullDate.split("T")[0] : "";
    setDob(dateOnly);
    setEmail(response.data.email);
    setPhone(response.data.phone);
    setDepartment(response.data.department);
    setDesignation(response.data.designation);
    setDoj(response.data.created_at.split("T")[0]);
    setFile(response.data.photo_url);
    setStatus(response.data.status);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("gender",gender);
    formData.append("dob",dob)
    formData.append("email", email);
    formData.append("department", department);
    formData.append("designation", designation);
    formData.append("created_at", doj);
    formData.append("phone", phone);
    formData.append("status", status);
    if (file) {
      formData.append("photo", file);
    }
    try {
      if (mode === "add") {
        await addEmployees(formData);
        alert("Submited Succussfully");
        handleReset();
      } else {
        await updateEmployee(id, formData);
        alert("Update Successfully");
      }
    } catch (error) {
      console.error("Failed to add employee:", error);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setDepartment("");
    setDesignation("");
    setDoj("");
    setFile(null);
    setDob(null);
    setStatus(null);
  };

  const triggerFileSelect = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("File selected:", selectedFile.name);
    }
  };

  return (
    <form
      onSubmit={handleAddEmployee}
      className="grid md:grid-cols-3 gap-2 text-textb mx-3 my-2 pt-10 md:pt-15 lg:pt-30 [grid-template-areas:'title'_'photo'_'details'] md:[grid-template-areas:'title_title_title'_'photo_details_details']"
    >
      <div className="[grid-area:title] flex flex-row gap-4 mb-4 items-center">
        <button  type="button" onClick={() => navigate(-1)}>
          <RiArrowLeftLine className="border border-gray-200 bg-gray-100 text-gray-700 size-8 p-1 rounded-sm" />
        </button>
        <p className="text-xl font-semibold">Employee</p>
        {mode === "view" && (
          <Link
            className="ml-auto bg-highlight text-textw px-4 py-1 rounded-md"
            to={`/employeeList/${id}/edit`}
          >
            Edit
          </Link>
        )}
      </div>
      <div className="flex flex-col justify-between [grid-area:details] border border-gray-200 rounded-md shadow-md ">
        <div className="px-5 rounded-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mode !== "view" && (
            <FormField
              label="Full Name"
              id="Full_Name"
              value={name}
              type="text"
              placeholder="Enter full name"
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {mode === "view" && (
            <FormField label="Employee ID" id="id" value={id} type="text" onChange={()=>{}}/>
          )}

          <div>
            <label
              htmlFor="gender"
              className="block text-[16px] font-semibold my-3"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              disabled={mode === "view"}
              onChange={(e) => setGender(e.target.value)}
              className="disabled:read-only disabled:appearance-none outline-none border border-gray-200 rounded-md px-2 py-2 w-full focus:ring-2 ring-blue-500"
            >
              <option value="null">Select your gender</option>
              {genderArray.map((e) => (
                <option value={e} key={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <FormField
            label="Date Of Birth"
            id="dob"
            type="Date"
            value={dob}
            placeholder="Enter your date of birth"
            onChange={(e) => setDob(e.target.value)}
            mode={mode}
          />

          <FormField
            label="E Mail"
            id="Email"
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            mode={mode}
          />
          <FormField
            label="Phone Numer"
            id="Phone_Number"
            type="tel"
            value={phone}
            placeholder="Enter phone number"
            onChange={(e) => setPhone(e.target.value)}
            mode={mode}
          />
          <div>
            <label
              htmlFor="department"
              className="block text-[16px] font-semibold my-3"
            >
              Department
            </label>
            <select
              id="department"
              name="department"
              value={department}
              disabled={mode === "view"}
              onChange={(e) => setDepartment(e.target.value)}
              className="diabled:read-only disabled:appearance-none outline-none focus:ring-2 ring-blue-500 border border-gray-200 rounded-md px-2 py-2 w-full"
            >
              <option value="null">Select Department</option>
              {departmentArray.map((d) => (
                <option value={d} key={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <FormField
            label="Designation"
            id="designation"
            type="text"
            value={designation}
            placeholder="Enter Designation"
            onChange={(e) => setDesignation(e.target.value)}
            mode={mode}
          />
          <FormField
            label="Date of Joining"
            id="doj"
            type="date"
            value={doj}
            onChange={(e) => setDoj(e.target.value)}
            mode={mode}
          />
          <div>
            <label
              htmlFor="status"
              className="block text-[16px] font-semibold my-3"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={status}
              disabled={mode === "view"}
              onChange={(e) => setStatus(e.target.value)}
              className="diabled:read-only disabled:appearance-none outline-none focus:ring-2 ring-blue-500 border border-gray-200 rounded-md px-2 py-2 w-full"
            >
              <option value="null">Select Status</option>
              {statusArray.map((d) => (
                <option value={d} key={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        {mode !== "view" && (
          <div className="flex flex-row gap-5 py-10 px-5">
            <button
              type="button"
              disabled={mode === "view"}
              onClick={handleReset}
              className="border border-gray-200 px-5 py-2 rounded-md font-semibold text-textb hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={mode === "view"}
              className="border border-gray-200 px-4 py-2 rounded-md font-semibold bg-highlight text-textw hover:bg-blue-600 transition-colors"
            >
              Save Employee
            </button>
          </div>
        )}
      </div>
      <div className="[grid-area:photo] border border-gray-200 rounded-md shadow-md grid md:grid-rows-2 gap-5 justify-items-center py-5">
        {/* The Profile Icon */}
        {file instanceof File || file instanceof Blob ? (
          // Show the uploaded image if a file exists
          <img
            src={URL.createObjectURL(file)}
            alt="Profile Preview"
            className="size-40 border border-gray-200 rounded-full object-cover p-1"
          />
        ) : typeof file === "string" && file ? (
          // Show existing photo URL coming from the database
          <img
            src={`http://localhost:5000${file.startsWith("/") ? file : `/${file}`}`}
            alt="Employee Profile"
            className="size-40 border border-gray-200 rounded-full object-cover p-1"
          />
        ) : (
          <RiUserFill className="text-gray-400 size-40 border border-gray-200 rounded-full p-8" />
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        {mode !== "view" && (
          <div
            onClick={triggerFileSelect}
            className="disabled:hidden border border-dashed border-gray-200 p-6 rounded-md cursor-pointer flex flex-col justify-center items-center hover:bg-gray-50"
          >
            <RiUploadCloud2Line className="text-blue-500 size-8 mb-2" />
            <p className="font-medium text-sm text-blue-500">
              {file ? file.name : "Upload Photo"}
            </p>
            <p className="text-xs text-gray-400">JPG, PNG (MAX. 2MB)</p>
          </div>
        )}

        {mode === "view" && (
          <div className="flex flex-col justify-center items-center gap-3">
            <p className="text-2xl font-semibold">{name}</p>
            <span
              className={`px-2 py-1 rounded-md font-semibold text-[14px] ${status === "Active" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}
            >
              <p className="animate-pulse">{status}</p>
            </span>
          </div>
        )}
      </div>
    </form>
  );
}

export default EmployeeForm;

import AttendanceList from "./AttendanceList";
import Navbar from "../component/Navbar";
import EmployeeForm from "./EmployeeForm";
import { Route, Routes } from "react-router-dom";
import { RiMenuLine } from "@remixicon/react";
import { useState } from "react";
import EmployeeList from "./EmployeeList";
import Home from "./Home";
import Report from "./Report";
import Settings from "./Settings";
function Dashboard() {
  const [isOpen, setOpen] = useState(
    () => localStorage.getItem("sideBar") === "true",
  );
  const toggleSidebar = () => {
    setOpen((side) => {
      const nextState = !side;
      localStorage.setItem("sideBar", nextState);
      return nextState;
    });
  };
  return (
    <div
      className={`bg-background w-screen h-screen grid transition-all ease-in-out duration-200  ${isOpen ? "grid-cols-[280px_1fr]" : "grid-cols-[50px_1fr] "}`}
    >
      <nav className="overflow-hidden h-full ">
        <Navbar mode={isOpen ? true : false} />
      </nav>
      <div className="overflow-auto">
        <button className="cursor-pointer" onClick={toggleSidebar}>
          <RiMenuLine className="m-2 text-accent" />
        </button>
        <main className="w-full max-w-7xl justify-self-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-employee" element={<EmployeeForm />} />
            <Route path="/attendanceList" element={<AttendanceList />} />
            <Route path="/employeeList/addEmployee" element={<EmployeeForm mode={"add"}/>} />
            <Route path="/employeeList/:id" element={<EmployeeForm mode={"view"} />}></Route>
            <Route path="/employeeList/:id/edit" element={<EmployeeForm mode={"edit"} />}></Route>
            <Route path="/employeeList" element={<EmployeeList />} />
            <Route path="/report" element={<Report />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

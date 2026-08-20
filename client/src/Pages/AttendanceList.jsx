import { useState, useEffect, useCallback } from "react";
import {
  getAttendance,
  updateAttendance,
  getEmployeeList,
  addAttendance,
  updateCheckOutAttendance,
  deleteAttendance,
} from "../api/Api";
import Card from "../component/card";
import {
  RiEditBoxLine,
  RiCloseLine,
  RiSearchLine,
  RiDeleteBin2Line,
  RiPencilLine,
} from "@remixicon/react";
import Navbar from "../component/Navbar";
import { Link } from "react-router-dom";

function AttendanceList() {
  const [attendance, setAttendance] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState({
    name: "",
    designation: "",
  });
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [currentTime, setCurrenTime] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [existingAttendance, setExistingAttendance] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = useState(null);

  const fetchAttendance = useCallback(async () => {
    try {
      const response = await getAttendance(date);
      setAttendance(response.data.AttendanceList || []);
      setEmployeeList(response.data.EmployeeList || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  }, [date]);

  useEffect(() => {
    fetchAttendance();
  }, [date, fetchAttendance]);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    setCurrenTime(formattedTime);
    return formattedTime;
  };

  const confirmDelete = async () => {
    try {
      await deleteAttendance(date, attendanceToDelete);
      setDeleteDialog(false);
      setAttendanceToDelete(null);
      fetchAttendance();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmployeeSelect = (e) => {
    const empId = e.target.value;
    setSelectedEmployeeId(empId);

    if (!empId || empId === "null" || empId === undefined) {
      handleReset();
      return;
    }

    const foundEmployee = employeeList.find(
      (employee) => employee && String(employee.id) === String(empId)
    );

    if (foundEmployee) {
      setSelectedEmployeeDetails({
        name: foundEmployee.name || "",
        designation: foundEmployee.designation || "",
      });

      const foundRecord = (attendance || []).find(
        (record) => record && String(record.id) === String(empId)
      );
      
      setExistingAttendance(foundRecord || null);

      if (foundRecord && foundRecord.check_in) {
        setCheckInTime(foundRecord.check_in || "");
        setCheckOutTime(foundRecord.check_out || getCurrentTime());
        setIsCheckedIn(true);
      } else {
        setCheckInTime(getCurrentTime());
        setCheckOutTime("");
        setIsCheckedIn(false);
      }
    } else {
      setSelectedEmployeeDetails({ name: "", designation: "" });
      setCheckInTime("");
      setCheckOutTime("");
      setIsCheckedIn(false);
      setExistingAttendance(null);
    }
  };

  const handleReset = () => {
    setSelectedEmployeeId(null);
    setSelectedEmployeeDetails({ name: "", designation: "" });
    setIsLoadingAttendance(false);
    setCheckInTime("");
    setCheckOutTime("");
    setIsCheckedIn(false);
    setExistingAttendance(null);
  };

  const filteredAttendance = (attendance || []).filter((record) => {
    const matchesSearch =
      searchEmployee === "" ||
      (record.name && record.name.toLowerCase().includes(searchEmployee.toLowerCase())) ||
      String(record.id).includes(searchEmployee);
      
    const matchesDepartment =
      selectedDepartment === "All" || record.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const handleEdit = (r) => {
    setSelectedRecord({
      ...r,
      check_in: r.check_in || "",
      check_out: r.check_out || "",
      status: r.status || "Present",
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let editedAttendance = {};
      if (
        selectedRecord.status === "Absent" ||
        selectedRecord.status === "Leave"
      ) {
        editedAttendance = {
          date: date,
          status: selectedRecord.status,
          check_in: null,
          check_out: null,
        };
      } else {
        editedAttendance = {
          date: date,
          status: selectedRecord.status,
          check_in: selectedRecord.check_in,
          check_out: selectedRecord.check_out,
        };
      }
      await updateAttendance(editedAttendance, selectedRecord.id);
      alert("Updated Successfully");

      setIsEditing(false);
      setSelectedRecord(null);

      const updatedAttendance = await getAttendance(date);
      setAttendance(updatedAttendance.data.AttendanceList || []);
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const handleAttendance = async (e) => {
    e.preventDefault();

    const selectedStatus = e.target.status.value;
    let payload = {};

    if (selectedStatus === "Absent" || selectedStatus === "Leave") {
      payload = {
        employee_id: selectedEmployeeId,
        date: date,
        status: selectedStatus,
        check_in: null,
        check_out: null,
      };
    } else {
      if (existingAttendance && existingAttendance.check_in) {
        payload = {
          employee_id: selectedEmployeeId,
          date: date,
          check_out: checkOutTime,
        };
      } else {
        payload = {
          employee_id: selectedEmployeeId,
          date: date,
          status: selectedStatus,
          check_in: checkInTime,
        };
      }
    }

    try {
      if (existingAttendance && existingAttendance.check_in) {
        await updateCheckOutAttendance(payload);
        alert("Updated Successfully");
        handleReset();
      } else {
        await addAttendance(payload);
        alert("Attendance marked successfully");
        handleReset();
      }
      const updatedAttendance = await getAttendance(date);
      setAttendance(updatedAttendance.data.AttendanceList || []);
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  const departmentArray = [
    "All",
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

  return (
    <div className="pt-4 px-2 md:pt-8 lg:pt-12">
      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold ">Attendance</p>
        <button
          onClick={() => {
            setIsLoadingAttendance(true);
            getCurrentTime();
          }}
          className="bg-highlight text-textw px-4 py-2 rounded-md hover:bg-blue-600 transition-colors "
        >
          Mark Attendance
        </button>
        {isLoadingAttendance && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleReset();
            }}
          >
            <form
              onSubmit={handleAttendance}
              className="bg-background rounded-md shadow-xl p-4 grid grid-cols-2 gap-4 items-center"
            >
              <label htmlFor="EmployeeID" className="block font-semibold my-3">
                Employee ID
              </label>
              <select
                id="EmployeeID"
                name="EmployeeID"
                value={selectedEmployeeId || "null"}
                onChange={handleEmployeeSelect}
                className="outline-none border border-gray-200 rounded-md px-2 py-2 w-full"
              >
                <option value="null">Select Employee ID</option>
                {employeeList.map((record) => (
                  <option value={record.id} key={record.id}>
                    {record.id}
                  </option>
                ))}
              </select>
              <label htmlFor="name" className="font-semibold my-3">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={selectedEmployeeDetails.name || ""}
                readOnly
                className="outline-none border border-gray-200 rounded-md px-2 py-2 w-full"
              />
              <label htmlFor="designation" className="font-semibold my-3">
                Designation
              </label>
              <input
                type="text"
                id="designation"
                value={selectedEmployeeDetails.designation || ""}
                readOnly
                className="outline-none border border-gray-200 rounded-md px-2 py-2 w-full"
              />
              <label htmlFor="status" className="font-semibold my-3">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="outline-none border border-gray-200 rounded-md px-2 py-2 w-full"
              >
                <option value="Present">Present</option>
                <option value="Leave">Leave</option>
                <option value="Half Day">Half Day </option>
                <option value="Absent">Absent</option>
              </select>

              <label htmlFor="checkin" className="font-semibold my-3">
                Check In
              </label>
              <input
                type="time"
                step="1"
                value={checkInTime || ""}
                readOnly={Boolean(checkInTime)}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="outline-none border border-gray-200 rounded-md px-2 py-2 w-full"
              />

              {isCheckedIn && (
                <>
                  <label htmlFor="checkout" className="font-semibold my-3">
                    Check out
                  </label>
                  <input
                    type="time"
                    step="1"
                    value={checkOutTime || ""}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    className="outline-none border border-gray-200 rounded-md px-2 py-2 w-full"
                  />
                </>
              )}
              <button
                type="submit"
                className="col-span-2 bg-highlight py-2 rounded-md text-textw hover:bg-blue-600 transition-colors"
              >
                {isCheckedIn ? "Check Out" : "Check In"}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="my-4 flex flex-col md:flex-row gap-4 text-textb">
        <div className="border border-gray-200 px-2 py-2 rounded-md">
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="outline-none w-full"
          />
        </div>
        <div className="border border-gray-200 px-2 py-2 rounded-md flex flex-row items-center gap-2">
          <RiSearchLine size={20} />
          <input
            type="text"
            placeholder="Search Employee"
            className="outline-none"
            value={searchEmployee}
            onChange={(e) => setSearchEmployee(e.target.value)}
          />
        </div>
        <div className="outline-none border border-gray-200 px-2 py-2 rounded-md md:ml-auto">
          <select
            name="Department"
            id="department"
            className="outline-none w-full px-2"
            onChange={(e) => setSelectedDepartment(e.target.value)}
            value={selectedDepartment}
          >
            {departmentArray.map((o) => (
              <option value={o} key={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-text border border-gray-200 rounded-md shadow-md  my-6 min-w-175 overflow-auto">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center text-textb bg-gray-200 px-2 py-3 font-semibold">
          <div>Employee</div>
          <div>ID</div>
          <div>Check in</div>
          <div>Check out</div>
          <div className="px-2">Status</div>
          <div>Action</div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredAttendance.length === 0 && (
            <div className="col-span-6 text-center py-4 text-textb">
              No Data Found
            </div>
          )}
          {filteredAttendance.map((record) => (
            <div
              key={record.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] text-textb items-center p-2"
            >
              <div>
                <Card
                  name={record.name}
                  depart={record.department}
                  url={record.photo_url}
                />
              </div>
              <div>{record.id}</div>
              <div className={`${record.check_in === null ? "px-8" : "px-0"}`}>
                {record.check_in || "-"}
              </div>
              <div className={`${record.check_out === null ? "px-8" : "px-0"}`}>
                {record.check_out || "-"}
              </div>
              <div
                className={`px-1 py-1 w-16 text-center font-semibold text-[14px] rounded-md justify-self-start ${record.status === "Present" ? "text-green-500 bg-green-100" : record.status === "Leave" ? "text-blue-500 bg-blue-100" : record.status === "Half Day" ? "text-orange-500 bg-orange-100" : "text-red-500 bg-red-100"}`}
              >
                {record.status || "-"}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="bg-blue-100 p-1 text-blue-500 hover:text-blue-700 rounded-md"
                  onClick={() => handleEdit(record)}
                >
                  <RiPencilLine size={20} />
                </button>
                <button
                  className="bg-red-100 p-1 text-red-500 hover:text-red-700 rounded-md"
                  onClick={() => {
                    setAttendanceToDelete(record.id);
                    setDeleteDialog(true);
                  }}
                >
                  <RiDeleteBin2Line size={19} />
                </button>
              </div>
            </div>
          ))}
          {isEditing && selectedRecord && (
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsEditing(false);
              }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
            >
              <form
                onSubmit={handleSubmit}
                className="relative bg-background rounded-md  shadow-xl px-8 py-8"
              >
                <Card
                  name={selectedRecord.name}
                  depart={selectedRecord.department}
                  url={selectedRecord.photo_url}
                />
                <div className="grid grid-cols-2 gap-4 items-center mt-4">
                  <label htmlFor="check_in">Check in</label>
                  <input
                    type="time"
                    step="1"
                    name="check_in"
                    id="check_in"
                    value={selectedRecord.check_in || ""}
                    onChange={(e) =>
                      setSelectedRecord({
                        ...selectedRecord,
                        check_in: e.target.value,
                      })
                    }
                    className="outline-none border border-gray-200  py-2 px-2 rounded-md"
                  />
                  <label htmlFor="check_out">Check out</label>
                  <input
                    type="time"
                    name="check_out"
                    id="check_out"
                    step="1"
                    value={selectedRecord.check_out || ""}
                    onChange={(e) =>
                      setSelectedRecord({
                        ...selectedRecord,
                        check_out: e.target.value,
                      })
                    }
                    className="outline-none border border-gray-200 py-2 px-2 rounded-md"
                  />
                  <label htmlFor="status">Status</label>
                  <select
                    name="status"
                    id="status"
                    value={selectedRecord.status || "Present"}
                    onChange={(e) =>
                      setSelectedRecord({
                        ...selectedRecord,
                        status: e.target.value,
                      })
                    }
                    className="outline-none border border-gray-200 py-2 px-2 rounded-md"
                  >
                    <option value="Present">Present</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Leave">Leave</option>
                    <option value="Absent">Absent</option>
                  </select>

                  <button
                    type="submit"
                    className="col-span-2 bg-highlight text-textw px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      {deleteDialog && (
        <div
          className="fixed flex justify-center items-center inset-0 bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteDialog(false);
          }}
        >
          <div className="grid grid-rows-[auto_1fr_auto]">
            <div className="bg-blue-900 text-textw p-2 flex justify-between rounded-t-md">
              <p className="">Confirm Deletion</p>
              <button onClick={() => setDeleteDialog(false)}>x</button>
            </div>
            <div className="py-6 px-2 bg-gray-50">
              Are you sure you want to delete this employee permanently?
            </div>
            <div className="flex gap-4 px-2 py-4 bg-gray-50 rounded-b-md">
              <button
                className="ml-auto bg-blue-50 hover:bg-blue-100 border border-gray-200 rounded-md px-4"
                onClick={() => setDeleteDialog(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-900 hover:bg-blue-950 text-textw rounded-md px-4"
                onClick={() => confirmDelete()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceList;
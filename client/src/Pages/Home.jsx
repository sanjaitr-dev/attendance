import {
  RiUserLine,
  RiCheckLine,
  RiCloseLine,
  RiCalendarLine,
} from "@remixicon/react";
import { useEffect,useCallback } from "react";
import { Link } from "react-router-dom";
import { getTodayAttendance } from "../api/Api";
import { useState } from "react";
import { Chart, ArcElement, Tooltip, Legend, plugins, layouts } from "chart.js";
import { Doughnut } from "react-chartjs-2";

function Home() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [totalCount, setTotalCount] = useState({});
  const {
    total_active_employee: total =0,
    total_present: present =0,
    total_leave: leave =0,
  } = totalCount;
  const absent = total - (present + leave);

  const fetchAttendance = useCallback(async () => {
      const response = await getTodayAttendance();
      setAttendanceList(response.data.Attendance);
      setTotalCount(response.data.Count);
    },[]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  Chart.register(ArcElement, Tooltip, Legend);
  // const local = "http://localhost:5000";
  const local ="https://mmcmjk9z-5000.inc1.devtunnels.ms";
  const pieData = {
    labels: ["Present", "Absent", "Leave"],
    datasets: [
      {
        label: "Attendance Distribution",
        data: [present, absent, leave],
        backgroundColor: [
          "rgba(16, 185, 129, 0.9)", // Matches Present Card Green
          "rgba(239, 68, 68, 0.9)", // Matches Absent Card Red
          "rgba(249, 115, 22, 0.9)", // Matches Leave Card Orange
        ],
        borderColor: [
          "rgba(5, 150, 105, 1)",
          "rgba(220, 38, 38, 1)",
          "rgba(234, 88, 12, 1)",
        ],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 10,
          boxWidth: 12,
          boxHeight: 12,
        },
      },
    },
  };

  return (
    <div className="pt-6 px-2 md:pt-10 lg:pt-14">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4">
        <div className="flex justify-around items-center  bg-blue-100 p-4 rounded-md shadow-md">
          <RiUserLine
            className="text-blue-600 border-2 rounded-full px-3 "
            size={50}
          />
          <div>
            <p className="font-semibold">Total Employees</p>
            <p className="text-2xl font-semibold">{total}</p>
            <Link to="/employeeList" className="text-gray-500 text-[13px]">
              View all employees
            </Link>
          </div>
        </div>
        <div className="flex  justify-around items-center bg-green-100 p-4 rounded-md shadow-md">
          <RiCheckLine
            className="text-green-600 border-2 rounded-full px-1"
            size={50}
          />
          <div>
            <p className="font-semibold">Present Today</p>
            <p className="text-2xl font-semibold">{present}</p>
            <p className="text-[13px] text-gray-500 py-1">
              {((present / total) * 100).toFixed(2)}% of total
            </p>
          </div>
        </div>
        <div className="flex justify-around items-center bg-red-100 p-2 rounded-md shadow-md">
          <RiCloseLine
            size={50}
            className="text-red-500 border-2 rounded-full px-1"
          />
          <div>
            <p className="font-semibold">Absent Today</p>
            <p className="text-2xl font-semibold">{absent}</p>
            <p className="text-[13px] text-gray-500 py-1">
              {((absent / total) * 100).toFixed(2)}% of total
            </p>
          </div>
        </div>
        <div className="flex justify-around items-center bg-orange-100 p-2 rounded-md shadow-md">
          <RiCalendarLine
            size={50}
            className="text-orange-500 border-2 rounded-full px-2"
          />
          <div>
            <p className="font-semibold">Leave Today</p>
            <p className="text-2xl font-semibold">{leave}</p>
            <p className="text-[13px] text-gray-500 py-1">
              {((leave / total) * 100).toFixed(2)}% of total
            </p>
          </div>
        </div>
      </div>
      <div className="border border-gray-200 rounded-md p-2">
        <div className="col-span-2 flex justify-between items-center">
          <p className="truncate inline text-xl font-semibold">
            Recent Attendance
          </p>
          <Link
            to="/attendanceList"
            className="px-2 py-1 border border-gray-200 rounded-md text-blue-600"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
          <div className="mt-3">
            {/* Head Row */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border border-gray-200 rounded-t-md justify-items-center py-2 bg-gray-100 text-textb font-semibold">
              <div>Employee</div>
              <div>Check In</div>
              <div>Check Out</div>
              <div>Status</div>
            </div>

            {/* Body Row */}
            <div className="">
              {attendanceList.map((record) => (
                <div
                  key={record.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr] justify-items-center py-2 items-center border-x border-b border-gray-200 last:rounded-b-md "
                >
                  <div className="justify-self-start flex items-center gap-2 px-2">
                    <img
                      src={local.concat(record.photo_url)}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {record.name}
                  </div>
                  <div>{record.check_in || "-"}</div>
                  <div>{record.check_out || "-"}</div>
                  <div
                    className={`rounded-md px-2 w-17 text-center font-semibold text-[14px] ${record.status === "Present" ? "text-green-500 bg-green-100" : record.status === "Leave" ? "text-blue-500 bg-blue-100" : record.status === "Half Day" ? "text-orange-500 bg-orange-100" : "text-red-500 bg-red-100"}`}
                  >
                    {record.status || "Absent"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="justify-self-center my-4">
            <Doughnut data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;

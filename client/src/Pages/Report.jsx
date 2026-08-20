import { useEffect, useState } from "react";
import { getReport } from "../api/Api";

function Report() {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [department, setDepartment] = useState("All");
  const [totalAttendance,setTotalAttendacne] = useState("")
  const [report, setReport] = useState([]);
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

  const fetchReport = async () => {
    try {
      const response = await getReport(reportType, {
        date: dateRange,
        department: department,
      });
      setReport(response.data.result);
      setTotalAttendacne(response.data.count[0]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="pt-4 px-2 md:pt-8 lg:pt-12">
      <div className="grid [grid-template-areas:'filter'_'attendance'_'average'_'ontime'_'trends'_'table'] md:[grid-template-areas:'filter_filter_filter'_'attendance_average_ontime'_'trends_trends_trends'_'table_table_table'] gap-2 md:gap-4">
        <div className="flex flex-col gap-2 md:flex-row justify-between items-start [grid-area:filter] w-full border border-gray-200 rounded-md shadow-md p-3">
          <div className="flex items-center justify-between w-full md:w-auto">
            <label htmlFor="ReportType" className="md:pr-4 font-semibold w-full md:w-auto">
              Report Type
            </label>
            <select
              name="reportType"
              id="ReportType"
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setDateRange("");
              }}
              className="outline-none border border-gray-200 rounded-md px-2 py-1 w-full md:w-auto"
            >
              <option value="" className="text-gray-600">
                Select Summary Type
              </option>
              <option value="date">Daily</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
          <div className="flex items-center justify-between w-full md:w-auto">
            <label
              htmlFor="dateRange"
              className="font-semibold pr-4 w-full md:w-auto"
            >
              Date
            </label>
            <input
              type={reportType === "year" ? "number" : reportType}
              min={reportType === "year" ? "1980" : undefined}
              max={reportType === "year" ? "2100" : undefined}
              disabled={reportType === ""}
              name="dateRange"
              id="dateRange"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="disabled:read-only disabled:py-1 outline-none border border-gray-200 rounded-md px-2 py-1 w-full md:w-auto"
            />
          </div>
          <div className="flex items-center justify-between w-full md:w-auto">
            <label htmlFor="department" className="font-semibold pr-4 w-full md:w-auto">
              Department
            </label>
            <select
              name="department"
              id="department"
              className="border border-gray-200 rounded-md px-2 py-1 w-full"
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="All">All Department</option>
              {departmentArray.map((record) => (
                <option value={record} key={record}>
                  {record}
                </option>
              ))}
            </select>
          </div>
          <button
            className="disabled:cursor-not-allowed px-2 py-1 rounded-md bg-highlight text-textw"
            onClick={() => fetchReport()}
            disabled={reportType === "" || dateRange === ""}
          >
            Generate Report
          </button>
        </div>
        <div className="[grid-area:attendance] border border-gray-200 rounded-md shadow-md p-3">
          Total Attendance {totalAttendance.total}
        </div>
        <div className="[grid-area:average] border border-gray-200 rounded-md shadow-md p-3">
          Average Hours
        </div>
        <div className="[grid-area:ontime] border border-gray-200 rounded-md shadow-md p-3">
          On-Time Rate
        </div>
        <div className="[grid-area:trends] border border-gray-200 rounded-md shadow-md p-3">
          <p>Attendance Trends (Last 30 Days)</p>
        </div>
        <div className="[grid-area:table] pb-8">
          <div className="grid grid-cols-4 border border-gray-200 px-2 py-1 rounded-t-md bg-gray-100 font-semibold">
            <div>Name</div>
            <div>Department</div>
            <div>Status</div>
            <div>Date</div>
          </div>
          {report.map((record) => (
            <div
              className="grid grid-cols-4 border-r border-l border-b border-gray-200 px-2 py-1"
              key={record.id}
            >
              <div>{record.name}</div>
              <div>{record.department}</div>
              <div><p className={`inline px-2 text-center ${record.status==="Present"?"text-green-500":record.status==="Absent"?"text-red-500":"text-blue-500"}`}>{record.status}</p></div>
              <div>{record.date.split("T")[0]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Report;

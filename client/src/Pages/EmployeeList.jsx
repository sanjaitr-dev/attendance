import AddEmployee from "./EmployeeForm";
import { Link } from "react-router-dom";
import { RiArrowLeftLine, RiSearchLine } from "@remixicon/react";
import { useEffect, useState, useCallback } from "react";
import { deleteEmployee, getEmployeeList, getEmployees } from "../api/Api";
import { RiPencilLine, RiDeleteBin2Line, RiEyeLine } from "@remixicon/react";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const departmentArray = [
    "All Departments",
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
  const statusArray = ["All Status", "Active", "Inactive"];

  const fetchEmployee = useCallback(async () => {
    try {
      const response = await getEmployees({
        page,
        limit: 15,
        search: searchEmployee,
        department: selectedDepartment,
        status: selectedStatus,
      });

      if (response && response.data) {
        setEmployees(response.data.data);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
          setTotalItems(response.data.pagination.totalItems);
        }
      }
    } catch (error) {
      console.error(error);
      setEmployees([]);
    }
  }, [page, searchEmployee, selectedDepartment, selectedStatus]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const triggerDelete = (id) => {
    setEmployeeToDelete(id);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteEmployee(employeeToDelete);
      setDeleteDialog(false);
      setEmployeeToDelete(null);
      fetchEmployee();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pt-4 px-2 md:pt-8 lg:pt-12">
      <div className="flex justify-between items-center">
        <h1 className="text-textb text-xl font-semibold">Employees</h1>
        <Link
          to="/employeeList/addEmployee"
          className="bg-highlight rounded-md px-4 py-2 text-textw"
        >
          Add Employee
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-4 my-4">
        <div className="border border-gray-200 px-2 py-2 rounded-md flex flex-row items-center gap-2">
          <RiSearchLine size={20} />
          <input
            type="text"
            placeholder="Search Employee"
            className="outline-none"
            value={searchEmployee}
            onChange={(e) => {
              setSearchEmployee(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="outline-none border border-gray-200 px-2 py-2 rounded-md md:ml-auto">
          <select
            name="Department"
            id="department"
            className="outline-none w-full px-2"
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setPage(1);
            }}
            value={selectedDepartment}
          >
            {departmentArray.map((o) => (
              <option value={o} key={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div className="outline-none border border-gray-200 px-2 py-2 rounded-md">
          <select
            name="status"
            id="status"
            className="outline-none w-full px-2"
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            value={selectedStatus}
          >
            {statusArray.map((o) => (
              <option value={o} key={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Table */}
      <div className="text-text border border-gray-200 rounded-md shadow-md  my-6 overflow-auto">
        {/* Header Row  */}
        <div className="grid grid-cols-7  text-textb bg-gray-200 px-2 py-3 font-semibold min-w-175">
          <div>EMP ID</div>
          <div>Name</div>
          <div>Department</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {/* Body Row */}
        <div className="divide-y divide-gray-200 min-w-175 min-h-170">
          {employees.length === 0 && (
            <div className="col-span-6 text-center py-4 text-textb">
              No Data Found
            </div>
          )}
          {employees.map((record) => (
            <div
              key={record.id}
              className="grid grid-cols-7 text-textb items-center p-2"
            >
              <div className="truncate pr-2">{record.id}</div>
              <div className="font-semibold truncate pr-2">{record.name}</div>
              <div className="truncate pr-2">{record.department}</div>
              <div className="truncate pr-2" title={record.email}>
                {record.email}
              </div>
              <div className="truncate pr-2">{record.phone}</div>
              <div
                className={`truncate pr-2 px-2 py-1 rounded-md text-xs font-medium w-fit ${
                  record.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {record.status}
              </div>
              <div className="flex items-center gap-1">
                <Link
                  className="text-blue-500 bg-blue-100 hover:text-blue-700 p-1 rounded-md"
                  to={`/employeeList/${record.id}`}
                >
                  <RiEyeLine size={20} />
                </Link>
                <Link
                  className="text-blue-500 bg-blue-100 hover:text-blue-700 p-1 rounded-md"
                  to={`/employeeList/${record.id}/edit`}
                >
                  <RiPencilLine size={20} />
                </Link>
                <button
                  className="text-red-500 bg-red-100  hover:text-red-700 p-1 rounded-md"
                  onClick={() => triggerDelete(record.id)}
                >
                  <RiDeleteBin2Line size={19} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Footer Controls */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-900">
            Showing {page} to {totalPages || 1} of{" "}
            {totalItems > 0 && ` ${totalItems} entries`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
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

export default EmployeeList;

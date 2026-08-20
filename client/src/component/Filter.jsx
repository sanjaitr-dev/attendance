import { useState } from "react";
import { RiSearchLine } from "@remixicon/react"

function Filter({ searchEmployee, setSearchEmployee, selectedDepartment, setSelectedDepartment, date, setDate }) {

    
  
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

  const handleDateChange = (e) => {
    setDate(e.target.value);
    getAttendance(Date);
  }
  
  return (
   
  );
}

export default Filter;

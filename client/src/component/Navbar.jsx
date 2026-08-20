import useTheme from "../config/useTheme";
import { Link, useLocation } from "react-router-dom";
import {
  RiHome4Line,
  RiUser3Line,
  RiCalendarLine,
  RiSettingsLine,
  RiSunLine,
  RiMoonFill,
  RiFileChartLine,
} from "@remixicon/react";
function Navbar({ mode }) {
  const { theme, toggleTheme } = useTheme(localStorage.getItem("theme"));
  const location = useLocation();
  const getLinkClass = (path) => {
    const isActive =
      path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(path);
    const baseClass =
      "flex gap-2 items-center w-full text-start px-2 py-2 rounded-md transition-colors duration-300";

    if (isActive) {
      return `${baseClass} bg-blue-600 text-textw shadow-md`;
    }
    return `${baseClass} hover:bg-highlight`;
  };

  return (
    <div className="bg-accent text-textw h-full py-3 px-2 flex flex-col gap-5 items-start ">
      {mode ? (
        <>
          <Link to="/" className="flex items-center">
            <img src="src/assets/white.png" alt="" className="h-15 inline" />
            <div className="flex flex-col items-start">
              <p className="text-lg">AMS</p>
              <p className="text-sm">Sample Solgan </p>
            </div>
          </Link>

          <Link to="/" className={getLinkClass("/")}>
            <RiHome4Line size={20} />
            Home
          </Link>
          <Link to="/employeeList" className={getLinkClass("/employeeList")}>
            <RiUser3Line size={20} />
            Employee
          </Link>

          <Link
            to="/attendanceList"
            className={getLinkClass("/attendanceList")}
          >
            <RiCalendarLine size={20} />
            Attendance
          </Link>
          <Link to="/report" className={getLinkClass("/report")}>
            <RiFileChartLine size={20} />
            Reports
          </Link>
          <Link to="/settings" className={getLinkClass("/settings")}>
            <RiSettingsLine size={20} />
            Settings
          </Link>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 w-full text-start mt-auto px-2 py-2 rounded-md hover:bg-highlight transition-colors duration-300"
          >
            {theme === "light" ? (
              <>
                <RiSunLine size={20} /> Light{" "}
              </>
            ) : (
              <>
                <RiMoonFill size={20} /> Dark
              </>
            )}
          </button>
        </>
      ) : (
        <>
          <Link to="/" className="flex items-center justify-center">
            <img src="src/assets/white.png" alt="" className="h-7  inline" />
          </Link>

          <Link to="/" className={getLinkClass("/")}>
            <RiHome4Line size={20} />
          </Link>
          <Link to="/employeeList" className={getLinkClass("/employeeList")}>
            <RiUser3Line size={20} />
          </Link>

          <Link
            to="/attendanceList"
            className={getLinkClass("/attendanceList")}
          >
            <RiCalendarLine size={20} />
          </Link>
          <Link to="/report" className={getLinkClass("/report")}>
            <RiFileChartLine size={20} />
          </Link>
          <Link to="/settings" className={getLinkClass("/settings")}>
            <RiSettingsLine size={20} />
          </Link>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 w-full text-start mt-auto px-2 py-2 rounded-md hover:bg-highlight transition-colors duration-300"
          >
            {theme === "light" ? (
              <>
                <RiSunLine size={20} />
              </>
            ) : (
              <>
                <RiMoonFill size={20} />
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}

export default Navbar;

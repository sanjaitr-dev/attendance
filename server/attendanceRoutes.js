const express = require("express");
const router = express.Router();
const db = require("./db");

//Get Today Attendance
router.get("/recent", async (req,res) => {
  try
  {const today = new Date().toISOString().split('T')[0];
  const [countOfEmployee] = await db.query("select (select count(*) from employees where status = 'Active') as total_active_employee,count(case when a.status in ('Present','Half Day') then 1 end) as total_present, count(case when a.status = 'Leave' then 1 end) as total_leave from attendance a where a.date = ?",[today]);
  const [attendanceList] =await db.query("select e.id as employee_id, a.id, a.check_in, a.check_out,a.status,e.name, e.photo_url from employees e join attendance a on e.id = a.employee_id where date = ? order by created desc limit 15",[today]);
   res.json({Attendance : attendanceList,Count : countOfEmployee[0]});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//Get attendance based on date
router.get("/", async (req, res) => {
  const {date} = req.query;
  let query =
  "SELECT a.id AS attendance_id, a.employee_id, a.check_in, a.check_out, a.status, e.id, e.name, e.designation,e.photo_url FROM employees e JOIN attendance a ON e.id = a.employee_id AND a.date = ? order by created desc"; 
  try {
    const [employeeList] = await db.query("select id,name,designation from employees where status = 'Active'");
    const [rows] = await db.query(query, [date]);
    res.status(200).json({EmployeeList : employeeList,AttendanceList : rows});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//Add attendance
router.post("/", async (req, res) => {
  try {
    const { employee_id, date, status, check_in, check_out } = req.body;
    const [result] = await db.query(
      "insert into attendance (employee_id, date, status, check_in, check_out) values(?,?,?,?,?)",
      [employee_id, date, status, check_in, check_out],
    );
    res
      .status(201)
      .json({
        message: "Attendance created successfully",
        id: result.insertId
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Update Check out
router.post("/update", async (req,res) => {
  try {
    const { employee_id,date,check_out } = req.body;
    const [result] = await db.query("update attendance set check_out = ? where employee_id = ? and date = ?",[check_out,employee_id,date])
    res.status(200).json({message:"Updated successfully"});    
  } catch (error) {
    res.status(500).json({message:"Internal server Error"});
    console.log(error);
  }
});

//Update attendance
router.put("/:id", async (req, res) => {
  try {
    const { date, status, check_in, check_out } = req.body;
    const { id } = req.params;
    const [result] = await db.query(
      "update attendance set status=?, check_in=?, check_out=? where employee_id = ? and date = ?",
      [status, check_in, check_out, id, date],
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "attendance not found" });
    return res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//Delete attendance
router.delete("/:id", async (req, res) => {
  try {
    const {date} = req.query;
    const { id } = req.params;
    const [result] = await db.query("delete from attendance where employee_id = ? and date = ?", [
      id,date
    ]);
    if (result.affectedRows === 0)
      res.status(404).json({ error: "attendance not found" });
    res.status(200).json({ message: "attendance deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "Internal server error" });
  }
});

module.exports = router;

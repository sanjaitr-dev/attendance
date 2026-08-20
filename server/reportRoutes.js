const express = require("Express");
const db = require("./db");
const router = express.Router();


router.get("/report/:reportType", async(req,res) => {

    const { reportType } = req.params;
    const { date, department } = req.query;

    let query = "select e.id,e.name,e.department,a.* from employees e join attendance a on e.id = a.employee_id";
    let countQuery = "select count(a.id) as total from attendance a join employees e on e.id = a.employee_id";
    let countQueryValues = [];
    let queryValues = [];
    if(department !== "All"){
        query += " where e.department = ? and";
        countQuery += " where e.department = ? and";
        queryValues.push(department);
        countQueryValues.push(department);
    }else{
        query += ' where';
        countQuery += ' where';
    }
    if (reportType === "date") {
        query += " a.date = ?";
        countQuery += ' a.date = ?';
        queryValues.push(date);
        countQueryValues.push(date);
    } 
    else if (reportType === "month") {
        const [year, month] = date.split('-');
        const startDate = `${year}-${month}-01`;
        
        const nextMonth = new Date(Number(year), Number(month), 1);
        const endDate = nextMonth.toISOString().split("T")[0];

        query += " a.date >= ? AND a.date < ?";
        countQuery += " a.date >= ? AND a.date <= ?";
        queryValues.push(startDate, endDate);
        countQueryValues.push(startDate, endDate);
    } 
    else if (reportType === "year") {
        const yearNum = Number(date);
        const startDate = `${yearNum}-01-01`;
        
        const nextYear = new Date(yearNum + 1, 0, 1);
        const endDate = nextYear.toISOString().split("T")[0];

        query += " a.date >= ? and a.date < ?";
        countQuery += " a.date >= ? and a.date < ?";
        queryValues.push(startDate, endDate);
        countQueryValues.push(startDate, endDate);
    }

    try {
        
        const [result] = await db.query(query, queryValues);
        const [count] = await db.query(countQuery,countQueryValues);
        if (!result || result.length === 0) {
            
            return res.status(404).json({ message: "Data not found"});
        }
        
        return res.status(200).json({ result: result,count:count });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });        
    }
});

module.exports = router
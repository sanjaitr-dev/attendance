const express = require("express");
const db = require("./db");
const upload = require("./middleware/upload");
const router = express.Router();
const multer = require("multer");

//Get all employees List
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : "";
    const department =
      req.query.department && req.query.department !== "All Departments"
        ? req.query.department.trim()
        : "";
    const status =
      req.query.status && req.query.status !== "All Status"
        ? req.query.status.trim()
        : "";

    let query =
      "select id,name,department,email,phone,status, photo_url from employees";
    let countQuery = "select count(*) as total from employees";
    let conditions = [];
    let queryParams = [];
    let countParams = [];

    if (search !== "") {
      conditions.push("(name like ? or id = ?)");
      const searchWildCard = `%${search}%`;
      queryParams.push(searchWildCard, search);
    }

    if (department !== "") {
      conditions.push("department = ?");
      queryParams.push(department);
    }

    if (status !== "") {
      conditions.push("status = ?");
      queryParams.push(status);
    }

    if (conditions.length > 0) {
      const whereClause = " where " + conditions.join(" and ");
      query += whereClause;
      countQuery += whereClause;
    }

    countParams = [...queryParams];

    query += " order by id limit ? offset ?";
    queryParams.push(limit, offset);

    const [rows] = await db.query(query, queryParams);
    const [countRows] = await db.query(countQuery, countParams);

    const totalItems = countRows[0].total;

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        currentPAge: page,
        itemsPerPage: limit,
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / limit) || 1,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Create an employee
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Photo is required" });
    const photo_url = req.file.path;
    const { name, gender,dob,email, phone, department, designation, created_at,status } =
      req.body;

    const [result] = await db.query(
      "insert into employees (name,gender,dob,email,phone, department, designation,created_at,status, photo_url) values (?,?,?,?,?,?,?,?,?,?)",
      [
        name,
        gender,
        dob,
        email,
        phone,
        department,
        designation,
        created_at,
        status,
        photo_url,
      ],
    );
    res
      .status(201)
      .json({ message: "Employee added successfully", id: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create employee" });
  }
});

//Get employeeId List
router.get("/list", async (req, res) => {
  try {
    const [result] = await db.query("select id from employees");
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get employee by id
router.get("/:id", async (req, res) => {
  try {
    const [result] = await db.query("select * from employees where id = ?", [
      req.params.id,
    ]);

    if (result.length === 0)
      return res.status(404).json({ error: "Employee not found" });
    res.json(result[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Update employee
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const {
      name,
      email,
      department,
      designation,
      created_at,
      phone,
      dob,
      status,
    } = req.body;
    const { id } = req.params;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    let query = `UPDATE employees SET name = ?, email = ?, department = ?, designation = ?, created_at = ?, phone = ?, dob = ?, status = ?`;
    let queryParams = [
      name,
      email,
      department,
      designation,
      created_at,
      phone,
      dob,
      status,
    ];

    if (photoUrl) {
      query += `, photo_url = ?`;
      queryParams.push(photoUrl);
    }

    query += ` WHERE id = ?`;
    queryParams.push(id);

    const [result] = await db.query(query, queryParams);

    if (result.affectedRows === 0)
      res.status(404).json({ error: "Employee not found" });
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete employee
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("delete from employees where id = ?", [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Employee not found" });

    res.status(200).json({ message: "Employee deleted successdully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

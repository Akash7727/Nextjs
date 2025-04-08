require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 9000;
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

app.use(express.json());
app.use(cors());

// **Test Route**
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// **Signup Route**
app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User created successfully!", token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

// **Login Route**
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ 
      message: "Login successful", 
      token, 
      role: user.role, 
      userId: user.id // ✅ Sending userId
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
});

// **Get Employee List**
app.get("/employees", async (req, res) => {
  try {
    const { role } = req.query;

    let employees;
    if (role == 1) {
      employees = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true },
      });
    } else if (role == 2) {
      employees = await prisma.user.findMany({
        where: { role: 3 },
        select: { id: true, name: true, email: true, role: true },
      });
    } else {
      employees = [];
    }

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
});

// **Delete Employee (Fixed)**
app.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEmployee = await prisma.user.delete({
      where: { id: parseInt(id) }, // 🔥 FIXED: Convert id to integer
    });

    res.json({ message: "Employee deleted successfully", deletedEmployee });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Error deleting employee", error });
  }
});

// **Update Employee (Fixed)**
app.put("/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) }, // 🔥 FIXED: Convert id to integer
      data: { name, email, role }, // 🔥 FIXED: Allow role updates
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error });
  }
});

app.get("/projects", async (req, res) => {
  try {
    const { role, userId } = req.query;

    let projects;
    if (role == 1 || role == 2) {
      // Super Admin & HR can see all projects
      projects = await prisma.project.findMany({
        include: {
          assigned: { select: { id: true, name: true } },
          assigner: { select: { id: true, name: true, role: true } },
        },
      });
    } else if (role == 3) {
      // Employees can only see their assigned projects
      projects = await prisma.project.findMany({
        where: { assignedTo: parseInt(userId) },
        include: {
          assigned: { select: { id: true, name: true } },
          assigner: { select: { id: true, name: true, role: true } },
        },
      });
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
});


// **Create a New Project (Only Role 1 & 2)**
app.post('/projects', async (req, res) => {
  try {
    const { projectName, description, assignedTo, assignedBy, clientName, status } = req.body;

    const assigner = await prisma.user.findUnique({ where: { id: assignedBy } });
    if (!assigner || (assigner.role !== 1 && assigner.role !== 2)) {
      return res.status(403).json({ message: "Unauthorized to assign projects" });
    }

    const project = await prisma.project.create({
      data: { projectName, description, assignedTo, assignedBy, clientName, status },
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
});

// **Delete Project 
app.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
});

// **Update Project Status
app.put('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["In Progress", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error });
  }
});




app.get("/assign-to", async (req, res) => {
  try {
    const employees = await prisma.user.findMany({
      where: { role: 3 }, // Fetch only employees (Role 3)
      select: { id: true, name: true, email: true },
    });

    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Error fetching employees", error });
  }
});


app.put("/projects/:id", async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const { projectName, description, assignedTo, clientName, status, role } = req.body;

    // Only Super Admin (1) or HR (2) can update projects
    if (role !== 1 && role !== 2) {
      return res.status(403).json({ message: "Unauthorized: You cannot update projects." });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        projectName,
        description,
        assignedTo: assignedTo ? parseInt(assignedTo) : null,
        clientName,
        status,
      },
    });

    res.json({ message: "Project updated successfully!", updatedProject });
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error });
  }
});


// ✅ Submit Attendance (Employee)
app.post("/attendance", async (req, res) => {
  const { timeIn, timeOut } = req.body;
  const userId = req.headers.userid ;
  const role = req.headers.role
  

  if (!userId || role !== "3") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (!timeIn || !timeOut) {
    return res.status(400).json({ message: "Missing time fields" });
  }

  try {
    const attendance = await prisma.attendance.create({
      data: {
        userId: parseInt(userId),
        timeIn,
        timeOut,
      },
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error("Prisma error:", error);
    res.status(500).json({ message: "Failed to save attendance", error });
  }
});



// ✅ Get Attendance Records for Logged-In Employee
app.get("/api/attendance", async (req, res) => {
  try {
    const userId = parseInt(req.headers["userid"]);
    const role = parseInt(req.headers["role"]);
    const targetUserId = parseInt(req.headers["targetuserid"]); // New: Optional for HR/Admin

    if (!userId || !role) {
      return res.status(400).json({ message: "Missing user ID or role" });
    }

    let records;

    if (role === 1 || role === 2) {
      // HR & Super Admin
      if (targetUserId) {
        records = await prisma.attendance.findMany({
          where: { userId: targetUserId },
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
          orderBy: { date: "desc" },
        });
      } else {
        // If no targetUserId selected, return all
        records = await prisma.attendance.findMany({
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
          orderBy: { date: "desc" },
        });
      }
    } else if (role === 3) {
      // Employee: only their own records
      records = await prisma.attendance.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      });
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    res.json(records);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});



// **Start Server**
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

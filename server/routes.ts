import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import { z } from "zod";
import { setupAuth } from "./auth";
import {
  insertUserSchema,
  insertStudentSchema,
  insertTeacherSchema,
  insertBranchSchema,
  insertSectionSchema,
  insertClassSchema,
  insertSubjectSchema,
  insertSubjectAssignmentSchema,
  insertAttendanceSchema,
  insertAssignmentSchema,
  insertSubmissionSchema,
  insertMessageSchema,
  insertAnnouncementSchema,
  insertResourceSchema,
  insertStudentDocumentSchema,
  insertTimetableSchema,
  insertTaskSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication with Passport.js
  setupAuth(app);

  const apiRouter = express.Router();
  app.use("/api", apiRouter);

  // Authentication routes - using Passport.js which is set up in auth.ts
  // The /api/login route is already defined in auth.ts

  apiRouter.post("/auth/register", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid user data", errors: result.error.format() });
      }

      const existingUser = await storage.getUserByEmail(result.data.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists with this email" });
      }

      const newUser = await storage.createUser(result.data);
      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.post("/auth/logout", (req, res) => {
    req.session!.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  apiRouter.get("/auth/me", async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let userDetails: any = { ...user };
      
      if (user.role === "student") {
        const student = await storage.getStudentByUserId(user.id);
        if (student) {
          userDetails.student = student;
        }
      } else if (user.role === "teacher") {
        const teacher = await storage.getTeacherByUserId(user.id);
        if (teacher) {
          userDetails.teacher = teacher;
        }
      }

      return res.status(200).json(userDetails);
    } catch (error) {
      console.error("Get current user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // User routes
  apiRouter.get("/users", async (req, res) => {
    try {
      // In a real app, we would fetch from database here
      // For now, collect all users from the store
      const users = [];
      for (let i = 1; i <= 100; i++) {
        const user = await storage.getUser(i);
        if (user) users.push(user);
      }
      return res.status(200).json(users);
    } catch (error) {
      console.error("Get users error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.get("/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Student routes
  apiRouter.get("/students", async (req, res) => {
    try {
      // Get classId from query if provided
      const classId = req.query.classId ? parseInt(req.query.classId as string) : undefined;
      
      // In a real app, we would fetch from database here
      // For now, collect all students from the store
      let students = [];
      
      if (classId) {
        students = await storage.getStudentsByClass(classId);
      } else {
        for (let i = 1; i <= 100; i++) {
          const student = await storage.getStudent(i);
          if (student) {
            // Get user data to include with student
            const user = await storage.getUser(student.userId);
            if (user) {
              students.push({
                ...student,
                user: {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  profileImage: user.profileImage
                }
              });
            }
          }
        }
      }
      
      return res.status(200).json(students);
    } catch (error) {
      console.error("Get students error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.get("/students/:id", async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const student = await storage.getStudent(studentId);
      
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      // Get user data to include with student
      const user = await storage.getUser(student.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found for this student" });
      }
      
      return res.status(200).json({
        ...student,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profileImage: user.profileImage
        }
      });
    } catch (error) {
      console.error("Get student error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Teacher routes
  apiRouter.get("/teachers", async (req, res) => {
    try {
      const teachers = await storage.getAllTeachers();
      
      // Enhance with user data
      const enhancedTeachers = await Promise.all(
        teachers.map(async (teacher) => {
          const user = await storage.getUser(teacher.userId);
          return {
            ...teacher,
            user: user ? {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              profileImage: user.profileImage
            } : null
          };
        })
      );
      
      return res.status(200).json(enhancedTeachers);
    } catch (error) {
      console.error("Get teachers error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Subject routes
  apiRouter.get("/subjects", async (req, res) => {
    try {
      const subjects = await storage.getAllSubjects();
      return res.status(200).json(subjects);
    } catch (error) {
      console.error("Get subjects error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Branches routes
  apiRouter.get("/branches", async (req, res) => {
    try {
      const branches = await storage.getAllBranches();
      return res.status(200).json(branches);
    } catch (error) {
      console.error("Get branches error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Sections routes
  apiRouter.get("/sections", async (req, res) => {
    try {
      const sections = await storage.getAllSections();
      return res.status(200).json(sections);
    } catch (error) {
      console.error("Get sections error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Classes routes
  apiRouter.get("/classes", async (req, res) => {
    try {
      const branchId = req.query.branchId ? parseInt(req.query.branchId as string) : undefined;
      const yearLevel = req.query.year ? parseInt(req.query.year as string) : undefined;
      
      let classes;
      
      if (branchId) {
        classes = await storage.getClassesByBranch(branchId);
      } else if (yearLevel) {
        classes = await storage.getClassesByYear(yearLevel);
      } else {
        classes = await storage.getAllClasses();
      }
      
      // Enhance with branch and section information
      const enhancedClasses = await Promise.all(
        classes.map(async (classItem) => {
          const branch = await storage.getBranch(classItem.branchId);
          const section = await storage.getSection(classItem.sectionId);
          
          return {
            ...classItem,
            branch: branch || null,
            section: section || null
          };
        })
      );
      
      return res.status(200).json(enhancedClasses);
    } catch (error) {
      console.error("Get classes error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Subject Assignment routes
  apiRouter.get("/subject-assignments", async (req, res) => {
    try {
      const teacherId = req.query.teacherId ? parseInt(req.query.teacherId as string) : undefined;
      const classId = req.query.classId ? parseInt(req.query.classId as string) : undefined;
      const subjectId = req.query.subjectId ? parseInt(req.query.subjectId as string) : undefined;
      
      let assignments = [];
      
      if (teacherId) {
        assignments = await storage.getSubjectAssignmentsByTeacher(teacherId);
      } else if (classId) {
        assignments = await storage.getSubjectAssignmentsByClass(classId);
      } else if (subjectId) {
        assignments = await storage.getSubjectAssignmentsBySubject(subjectId);
      }
      
      // Enhance with subject, teacher, and class information
      const enhancedAssignments = await Promise.all(
        assignments.map(async (assignment) => {
          const subject = await storage.getSubject(assignment.subjectId);
          const teacher = await storage.getTeacher(assignment.teacherId);
          const classItem = await storage.getClass(assignment.classId);
          
          let teacherUser = null;
          if (teacher) {
            teacherUser = await storage.getUser(teacher.userId);
          }
          
          return {
            ...assignment,
            subject: subject || null,
            teacher: teacher ? {
              ...teacher,
              user: teacherUser ? {
                firstName: teacherUser.firstName,
                lastName: teacherUser.lastName,
                profileImage: teacherUser.profileImage
              } : null
            } : null,
            class: classItem || null
          };
        })
      );
      
      return res.status(200).json(enhancedAssignments);
    } catch (error) {
      console.error("Get subject assignments error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Attendance routes
  apiRouter.get("/attendance", async (req, res) => {
    try {
      const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : undefined;
      const subjectAssignmentId = req.query.subjectAssignmentId ? parseInt(req.query.subjectAssignmentId as string) : undefined;
      const dateStr = req.query.date as string;
      
      let attendanceRecords = [];
      
      if (studentId && subjectAssignmentId) {
        attendanceRecords = await storage.getAttendanceByStudentAndSubject(studentId, subjectAssignmentId);
      } else if (dateStr) {
        const date = new Date(dateStr);
        attendanceRecords = await storage.getAttendanceByDate(date);
      }
      
      return res.status(200).json(attendanceRecords);
    } catch (error) {
      console.error("Get attendance error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.post("/attendance", async (req, res) => {
    try {
      const result = insertAttendanceSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid attendance data", errors: result.error.format() });
      }
      
      const newAttendance = await storage.createAttendance(result.data);
      return res.status(201).json(newAttendance);
    } catch (error) {
      console.error("Create attendance error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Assignment routes
  apiRouter.get("/assignments", async (req, res) => {
    try {
      const subjectAssignmentId = req.query.subjectAssignmentId 
        ? parseInt(req.query.subjectAssignmentId as string) 
        : undefined;
      
      let assignments = [];
      
      if (subjectAssignmentId) {
        assignments = await storage.getAssignmentsBySubjectAssignment(subjectAssignmentId);
      }
      
      return res.status(200).json(assignments);
    } catch (error) {
      console.error("Get assignments error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.post("/assignments", async (req, res) => {
    try {
      const result = insertAssignmentSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid assignment data", errors: result.error.format() });
      }
      
      const newAssignment = await storage.createAssignment(result.data);
      return res.status(201).json(newAssignment);
    } catch (error) {
      console.error("Create assignment error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Submission routes
  apiRouter.get("/submissions", async (req, res) => {
    try {
      const assignmentId = req.query.assignmentId ? parseInt(req.query.assignmentId as string) : undefined;
      const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : undefined;
      
      let submissions = [];
      
      if (assignmentId) {
        submissions = await storage.getSubmissionsByAssignment(assignmentId);
      } else if (studentId) {
        submissions = await storage.getSubmissionsByStudent(studentId);
      }
      
      return res.status(200).json(submissions);
    } catch (error) {
      console.error("Get submissions error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.post("/submissions", async (req, res) => {
    try {
      const result = insertSubmissionSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid submission data", errors: result.error.format() });
      }
      
      const newSubmission = await storage.createSubmission(result.data);
      return res.status(201).json(newSubmission);
    } catch (error) {
      console.error("Create submission error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Message routes
  apiRouter.get("/messages", async (req, res) => {
    try {
      const senderId = req.query.senderId ? parseInt(req.query.senderId as string) : undefined;
      const receiverId = req.query.receiverId ? parseInt(req.query.receiverId as string) : undefined;
      
      let messages = [];
      
      if (senderId) {
        messages = await storage.getMessagesBySender(senderId);
      } else if (receiverId) {
        messages = await storage.getMessagesByReceiver(receiverId);
      }
      
      return res.status(200).json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.post("/messages", async (req, res) => {
    try {
      const result = insertMessageSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid message data", errors: result.error.format() });
      }
      
      const newMessage = await storage.createMessage(result.data);
      return res.status(201).json(newMessage);
    } catch (error) {
      console.error("Create message error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Announcement routes
  apiRouter.get("/announcements", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const role = req.query.role as string;
      const classId = req.query.classId ? parseInt(req.query.classId as string) : undefined;
      
      let announcements = [];
      
      if (userId) {
        announcements = await storage.getAnnouncementsByUser(userId);
      } else if (role) {
        announcements = await storage.getAnnouncementsByRole(role);
      } else if (classId) {
        announcements = await storage.getAnnouncementsByClass(classId);
      }
      
      return res.status(200).json(announcements);
    } catch (error) {
      console.error("Get announcements error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.post("/announcements", async (req, res) => {
    try {
      const result = insertAnnouncementSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid announcement data", errors: result.error.format() });
      }
      
      const newAnnouncement = await storage.createAnnouncement(result.data);
      return res.status(201).json(newAnnouncement);
    } catch (error) {
      console.error("Create announcement error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Resource routes
  apiRouter.get("/resources", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const subjectId = req.query.subjectId ? parseInt(req.query.subjectId as string) : undefined;
      
      let resources = [];
      
      if (userId) {
        resources = await storage.getResourcesByUser(userId);
      } else if (subjectId) {
        resources = await storage.getResourcesBySubject(subjectId);
      }
      
      return res.status(200).json(resources);
    } catch (error) {
      console.error("Get resources error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.post("/resources", async (req, res) => {
    try {
      const result = insertResourceSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid resource data", errors: result.error.format() });
      }
      
      const newResource = await storage.createResource(result.data);
      return res.status(201).json(newResource);
    } catch (error) {
      console.error("Create resource error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Student Document routes
  apiRouter.get("/student-documents", async (req, res) => {
    try {
      const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : undefined;
      
      let documents = [];
      
      if (studentId) {
        documents = await storage.getStudentDocumentsByStudent(studentId);
      }
      
      return res.status(200).json(documents);
    } catch (error) {
      console.error("Get student documents error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.post("/student-documents", async (req, res) => {
    try {
      const result = insertStudentDocumentSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid student document data", errors: result.error.format() });
      }
      
      const newDocument = await storage.createStudentDocument(result.data);
      return res.status(201).json(newDocument);
    } catch (error) {
      console.error("Create student document error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Timetable routes
  apiRouter.get("/timetable", async (req, res) => {
    try {
      const subjectAssignmentId = req.query.subjectAssignmentId 
        ? parseInt(req.query.subjectAssignmentId as string) 
        : undefined;
      const day = req.query.day as string;
      
      let timetableEntries = [];
      
      if (subjectAssignmentId) {
        timetableEntries = await storage.getTimetableBySubjectAssignment(subjectAssignmentId);
      } else if (day) {
        timetableEntries = await storage.getTimetableByDay(day);
      }
      
      // Enhance timetable entries with subject assignment details
      const enhancedEntries = await Promise.all(
        timetableEntries.map(async (entry) => {
          const subjectAssignment = await storage.getSubjectAssignment(entry.subjectAssignmentId);
          
          if (!subjectAssignment) {
            return entry;
          }
          
          const subject = await storage.getSubject(subjectAssignment.subjectId);
          const classItem = await storage.getClass(subjectAssignment.classId);
          
          return {
            ...entry,
            subjectAssignment: {
              ...subjectAssignment,
              subject: subject || null,
              class: classItem || null
            }
          };
        })
      );
      
      return res.status(200).json(enhancedEntries);
    } catch (error) {
      console.error("Get timetable error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.post("/timetable", async (req, res) => {
    try {
      const result = insertTimetableSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid timetable data", errors: result.error.format() });
      }
      
      const newEntry = await storage.createTimetableEntry(result.data);
      return res.status(201).json(newEntry);
    } catch (error) {
      console.error("Create timetable entry error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Task routes
  apiRouter.get("/tasks", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      let tasks = [];
      
      if (userId) {
        tasks = await storage.getTasksByUser(userId);
      }
      
      return res.status(200).json(tasks);
    } catch (error) {
      console.error("Get tasks error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.post("/tasks", async (req, res) => {
    try {
      const result = insertTaskSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid task data", errors: result.error.format() });
      }
      
      const newTask = await storage.createTask(result.data);
      return res.status(201).json(newTask);
    } catch (error) {
      console.error("Create task error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.patch("/tasks/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      const updatedTask = await storage.updateTask(taskId, req.body);
      return res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Update task error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI-related routes
  apiRouter.post("/ai/summarize", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      // In a real app, we would call OpenAI API here
      // For now, return a mock summary
      const summary = `This is a summary of: ${text.substring(0, 50)}...`;
      
      return res.status(200).json({ summary });
    } catch (error) {
      console.error("AI summarize error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.post("/ai/question", async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question) {
        return res.status(400).json({ message: "Question is required" });
      }
      
      // In a real app, we would call OpenAI API here
      // For now, return a mock answer
      const answer = `Here is the answer to your question: "${question}"`;
      
      return res.status(200).json({ answer });
    } catch (error) {
      console.error("AI question error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin routes for pending user management
  apiRouter.get("/admin/pending-users", async (req, res) => {
    try {
      // Check if the user is an admin
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Only administrators can access this resource" });
      }
      
      const pendingUsers = await storage.getPendingUsers();
      return res.status(200).json(pendingUsers);
    } catch (error) {
      console.error("Get pending users error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.post("/admin/approve-user/:id", async (req, res) => {
    try {
      // Check if the user is an admin
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Only administrators can approve users" });
      }
      
      const userId = parseInt(req.params.id);
      const approvedUser = await storage.approveUser(userId);
      
      if (!approvedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.status(200).json(approvedUser);
    } catch (error) {
      console.error("Approve user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.post("/admin/reject-user/:id", async (req, res) => {
    try {
      // Check if the user is an admin
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Only administrators can reject users" });
      }
      
      const userId = parseInt(req.params.id);
      const rejectedUser = await storage.rejectUser(userId);
      
      if (!rejectedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.status(200).json(rejectedUser);
    } catch (error) {
      console.error("Reject user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  const httpServer = createServer(app);

  return httpServer;
}

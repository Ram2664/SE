import session from "express-session";
import memorystore from "memorystore";
import {
  users, students, teachers, branches, sections, classes, subjects,
  subjectAssignments, attendance, assignments, submissions, messages,
  announcements, resources, studentDocuments, timetable, tasks,
  type User, type Student, type Teacher, type Branch, type Section, 
  type Class, type Subject, type SubjectAssignment, type Attendance, 
  type Assignment, type Submission, type Message, type Announcement, 
  type Resource, type StudentDocument, type Timetable, type Task,
  type InsertUser, type InsertStudent, type InsertTeacher, type InsertBranch, 
  type InsertSection, type InsertClass, type InsertSubject, 
  type InsertSubjectAssignment, type InsertAttendance, type InsertAssignment, 
  type InsertSubmission, type InsertMessage, type InsertAnnouncement, 
  type InsertResource, type InsertStudentDocument, type InsertTimetable, 
  type InsertTask
} from "@shared/schema";

export interface IStorage {
  sessionStore: session.Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getPendingUsers(): Promise<User[]>;
  approveUser(id: number): Promise<User | undefined>;
  rejectUser(id: number): Promise<User | undefined>;
  
  // Student operations
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByUserId(userId: number): Promise<Student | undefined>;
  getStudentsByClass(classId: number): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, data: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: number): Promise<boolean>;
  
  // Teacher operations
  getTeacher(id: number): Promise<Teacher | undefined>;
  getTeacherByUserId(userId: number): Promise<Teacher | undefined>;
  getAllTeachers(): Promise<Teacher[]>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  updateTeacher(id: number, data: Partial<InsertTeacher>): Promise<Teacher | undefined>;
  deleteTeacher(id: number): Promise<boolean>;
  
  // Branch operations
  getBranch(id: number): Promise<Branch | undefined>;
  getAllBranches(): Promise<Branch[]>;
  createBranch(branch: InsertBranch): Promise<Branch>;
  updateBranch(id: number, data: Partial<InsertBranch>): Promise<Branch | undefined>;
  deleteBranch(id: number): Promise<boolean>;
  
  // Section operations
  getSection(id: number): Promise<Section | undefined>;
  getAllSections(): Promise<Section[]>;
  createSection(section: InsertSection): Promise<Section>;
  updateSection(id: number, data: Partial<InsertSection>): Promise<Section | undefined>;
  deleteSection(id: number): Promise<boolean>;
  
  // Class operations
  getClass(id: number): Promise<Class | undefined>;
  getAllClasses(): Promise<Class[]>;
  getClassesByBranch(branchId: number): Promise<Class[]>;
  getClassesByYear(year: number): Promise<Class[]>;
  createClass(classEntity: InsertClass): Promise<Class>;
  updateClass(id: number, data: Partial<InsertClass>): Promise<Class | undefined>;
  deleteClass(id: number): Promise<boolean>;
  
  // Subject operations
  getSubject(id: number): Promise<Subject | undefined>;
  getAllSubjects(): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: number, data: Partial<InsertSubject>): Promise<Subject | undefined>;
  deleteSubject(id: number): Promise<boolean>;
  
  // Subject Assignment operations
  getSubjectAssignment(id: number): Promise<SubjectAssignment | undefined>;
  getSubjectAssignmentsByTeacher(teacherId: number): Promise<SubjectAssignment[]>;
  getSubjectAssignmentsByClass(classId: number): Promise<SubjectAssignment[]>;
  getSubjectAssignmentsBySubject(subjectId: number): Promise<SubjectAssignment[]>;
  createSubjectAssignment(assignment: InsertSubjectAssignment): Promise<SubjectAssignment>;
  updateSubjectAssignment(id: number, data: Partial<InsertSubjectAssignment>): Promise<SubjectAssignment | undefined>;
  deleteSubjectAssignment(id: number): Promise<boolean>;
  
  // Attendance operations
  getAttendance(id: number): Promise<Attendance | undefined>;
  getAttendanceByStudentAndSubject(studentId: number, subjectAssignmentId: number): Promise<Attendance[]>;
  getAttendanceByDate(date: Date): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: number, data: Partial<InsertAttendance>): Promise<Attendance | undefined>;
  deleteAttendance(id: number): Promise<boolean>;
  
  // Assignment operations
  getAssignment(id: number): Promise<Assignment | undefined>;
  getAssignmentsBySubjectAssignment(subjectAssignmentId: number): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: number, data: Partial<InsertAssignment>): Promise<Assignment | undefined>;
  deleteAssignment(id: number): Promise<boolean>;
  
  // Submission operations
  getSubmission(id: number): Promise<Submission | undefined>;
  getSubmissionsByAssignment(assignmentId: number): Promise<Submission[]>;
  getSubmissionsByStudent(studentId: number): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateSubmission(id: number, data: Partial<InsertSubmission>): Promise<Submission | undefined>;
  deleteSubmission(id: number): Promise<boolean>;
  
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesBySender(senderId: number): Promise<Message[]>;
  getMessagesByReceiver(receiverId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: number, data: Partial<InsertMessage>): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;
  
  // Announcement operations
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  getAnnouncementsByUser(userId: number): Promise<Announcement[]>;
  getAnnouncementsByRole(role: string): Promise<Announcement[]>;
  getAnnouncementsByClass(classId: number): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, data: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;
  
  // Resource operations
  getResource(id: number): Promise<Resource | undefined>;
  getResourcesByUser(userId: number): Promise<Resource[]>;
  getResourcesBySubject(subjectId: number): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: number, data: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(id: number): Promise<boolean>;
  
  // Student Document operations
  getStudentDocument(id: number): Promise<StudentDocument | undefined>;
  getStudentDocumentsByStudent(studentId: number): Promise<StudentDocument[]>;
  createStudentDocument(document: InsertStudentDocument): Promise<StudentDocument>;
  updateStudentDocument(id: number, data: Partial<InsertStudentDocument>): Promise<StudentDocument | undefined>;
  deleteStudentDocument(id: number): Promise<boolean>;
  
  // Timetable operations
  getTimetableEntry(id: number): Promise<Timetable | undefined>;
  getTimetableBySubjectAssignment(subjectAssignmentId: number): Promise<Timetable[]>;
  getTimetableByDay(day: string): Promise<Timetable[]>;
  createTimetableEntry(entry: InsertTimetable): Promise<Timetable>;
  updateTimetableEntry(id: number, data: Partial<InsertTimetable>): Promise<Timetable | undefined>;
  deleteTimetableEntry(id: number): Promise<boolean>;
  
  // Task operations
  getTask(id: number): Promise<Task | undefined>;
  getTasksByUser(userId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, data: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  sessionStore: session.Store;
  
  private users: Map<number, User>;
  private students: Map<number, Student>;
  private teachers: Map<number, Teacher>;
  private branches: Map<number, Branch>;
  private sections: Map<number, Section>;
  private classes: Map<number, Class>;
  private subjects: Map<number, Subject>;
  private subjectAssignments: Map<number, SubjectAssignment>;
  private attendance: Map<number, Attendance>;
  private assignments: Map<number, Assignment>;
  private submissions: Map<number, Submission>;
  private messages: Map<number, Message>;
  private announcements: Map<number, Announcement>;
  private resources: Map<number, Resource>;
  private studentDocuments: Map<number, StudentDocument>;
  private timetable: Map<number, Timetable>;
  private tasks: Map<number, Task>;
  
  private userIdCounter: number;
  private studentIdCounter: number;
  private teacherIdCounter: number;
  private branchIdCounter: number;
  private sectionIdCounter: number;
  private classIdCounter: number;
  private subjectIdCounter: number;
  private subjectAssignmentIdCounter: number;
  private attendanceIdCounter: number;
  private assignmentIdCounter: number;
  private submissionIdCounter: number;
  private messageIdCounter: number;
  private announcementIdCounter: number;
  private resourceIdCounter: number;
  private studentDocumentIdCounter: number;
  private timetableIdCounter: number;
  private taskIdCounter: number;

  constructor() {
    // Initialize memory store for sessions
    const MemoryStore = memorystore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });

    this.users = new Map();
    this.students = new Map();
    this.teachers = new Map();
    this.branches = new Map();
    this.sections = new Map();
    this.classes = new Map();
    this.subjects = new Map();
    this.subjectAssignments = new Map();
    this.attendance = new Map();
    this.assignments = new Map();
    this.submissions = new Map();
    this.messages = new Map();
    this.announcements = new Map();
    this.resources = new Map();
    this.studentDocuments = new Map();
    this.timetable = new Map();
    this.tasks = new Map();
    
    this.userIdCounter = 1;
    this.studentIdCounter = 1;
    this.teacherIdCounter = 1;
    this.branchIdCounter = 1;
    this.sectionIdCounter = 1;
    this.classIdCounter = 1;
    this.subjectIdCounter = 1;
    this.subjectAssignmentIdCounter = 1;
    this.attendanceIdCounter = 1;
    this.assignmentIdCounter = 1;
    this.submissionIdCounter = 1;
    this.messageIdCounter = 1;
    this.announcementIdCounter = 1;
    this.resourceIdCounter = 1;
    this.studentDocumentIdCounter = 1;
    this.timetableIdCounter = 1;
    this.taskIdCounter = 1;

    // Initialize with some data
    this.initializeData();
  }

  private initializeData() {
    // Add branches
    const cseBranch = this.createBranch({ name: "Computer Science Engineering", description: "CSE Branch" });
    const eceBranch = this.createBranch({ name: "Electronics & Communication Engineering", description: "ECE Branch" });
    const meBranch = this.createBranch({ name: "Mechanical Engineering", description: "ME Branch" });
    
    // Add sections
    const sectionA = this.createSection({ name: "Section A" });
    const sectionB = this.createSection({ name: "Section B" });
    
    // Add classes
    const class1A = this.createClass({ yearLevel: 1, branchId: cseBranch.id, sectionId: sectionA.id, name: "CSE Year 1 - A" });
    const class2A = this.createClass({ yearLevel: 2, branchId: cseBranch.id, sectionId: sectionA.id, name: "CSE Year 2 - A" });
    
    // Add subjects
    const mathSubject = this.createSubject({ name: "Mathematics", code: "MATH101", description: "Fundamental Mathematics" });
    const physicsSubject = this.createSubject({ name: "Physics", code: "PHY101", description: "Basic Physics" });
    const csSubject = this.createSubject({ name: "Computer Science", code: "CS101", description: "Introduction to Computer Science" });
    
    // Add admin user with correct password format (hashed.salt)
    const adminUser = this.createUser({
      email: "admin@edusync.com",
      password: "5d178f9b505bb8cbfdbc0b34529886bc85afc64ecf7b169a54c6c9a0bfd0d11af2d15036dd6471e5eacd689544a97974e14c439d5f9bb2c4a2fef72a67e8fd8c.69e290f52be6a40bd23ac1ea92f8bc00", // admin123
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      status: "approved",
      profileImage: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
    });
    
    // Add teacher user
    const teacherUser = this.createUser({
      email: "teacher@edusync.com",
      password: "password123",
      firstName: "Maureen",
      lastName: "Smith",
      role: "teacher",
      status: "approved",
      profileImage: "https://ui-avatars.com/api/?name=Maureen+Smith&background=4F46E5&color=fff"
    });
    
    // Create teacher profile
    const teacher = this.createTeacher({
      userId: teacherUser.id,
      teacherId: "TCH001",
      specialization: "Mathematics"
    });
    
    // Add student users
    const student1User = this.createUser({
      email: "james@edusync.com",
      password: "password123",
      firstName: "James",
      lastName: "Wilson",
      role: "student",
      status: "approved",
      profileImage: "https://ui-avatars.com/api/?name=James+Wilson&background=22C55E&color=fff"
    });
    
    const student2User = this.createUser({
      email: "brandy@edusync.com",
      password: "password123",
      firstName: "Brandy",
      lastName: "Johnson",
      role: "student",
      status: "approved",
      profileImage: "https://ui-avatars.com/api/?name=Brandy+Johnson&background=EAB308&color=fff"
    });
    
    const student3User = this.createUser({
      email: "khloe@edusync.com",
      password: "password123",
      firstName: "Khloe",
      lastName: "Davis",
      role: "student",
      status: "approved",
      profileImage: "https://ui-avatars.com/api/?name=Khloe+Davis&background=EF4444&color=fff"
    });
    
    // Create student profiles
    const student1 = this.createStudent({
      userId: student1User.id,
      studentId: "ST20230001",
      yearLevel: 1,
      branchId: cseBranch.id,
      sectionId: sectionA.id,
      documents: {}
    });
    
    const student2 = this.createStudent({
      userId: student2User.id,
      studentId: "ST20230002",
      yearLevel: 1,
      branchId: cseBranch.id,
      sectionId: sectionA.id,
      documents: {}
    });
    
    const student3 = this.createStudent({
      userId: student3User.id,
      studentId: "ST20230003",
      yearLevel: 1,
      branchId: cseBranch.id,
      sectionId: sectionA.id,
      documents: {}
    });
    
    // Assign subjects to teacher
    const mathAssignment = this.createSubjectAssignment({
      teacherId: teacher.id,
      subjectId: mathSubject.id,
      classId: class1A.id
    });
    
    const physicsAssignment = this.createSubjectAssignment({
      teacherId: teacher.id,
      subjectId: physicsSubject.id,
      classId: class1A.id
    });
    
    const csAssignment = this.createSubjectAssignment({
      teacherId: teacher.id,
      subjectId: csSubject.id,
      classId: class1A.id
    });
    
    // Create timetable entries
    this.createTimetableEntry({
      subjectAssignmentId: mathAssignment.id,
      day: "monday",
      startTime: "08:00:00",
      endTime: "09:30:00",
      room: "Room 101"
    });
    
    this.createTimetableEntry({
      subjectAssignmentId: physicsAssignment.id,
      day: "monday",
      startTime: "10:00:00",
      endTime: "11:30:00",
      room: "Room 102"
    });
    
    this.createTimetableEntry({
      subjectAssignmentId: csAssignment.id,
      day: "monday",
      startTime: "11:00:00",
      endTime: "12:30:00",
      room: "Lab 2"
    });
    
    // Create assignments
    const assignment1 = this.createAssignment({
      title: "Mathematics Assignment 1",
      description: "Solve the given problems",
      subjectAssignmentId: mathAssignment.id,
      dueDate: new Date("2023-08-15"),
      maxMarks: 100
    });
    
    const assignment2 = this.createAssignment({
      title: "Physics Assignment 1",
      description: "Solve the given problems",
      subjectAssignmentId: physicsAssignment.id,
      dueDate: new Date("2023-08-20"),
      maxMarks: 100
    });
    
    // Create submissions
    this.createSubmission({
      assignmentId: assignment1.id,
      studentId: student1.id,
      submissionUrl: "https://example.com/submission1",
      marks: 70,
      status: "marked"
    });
    
    this.createSubmission({
      assignmentId: assignment1.id,
      studentId: student2.id,
      submissionUrl: "https://example.com/submission2",
      marks: 48,
      status: "marked"
    });
    
    this.createSubmission({
      assignmentId: assignment1.id,
      studentId: student3.id,
      submissionUrl: "https://example.com/submission3",
      marks: 21,
      status: "marked"
    });
    
    // Create attendance records
    this.createAttendance({
      studentId: student1.id,
      subjectAssignmentId: mathAssignment.id,
      date: new Date("2023-08-07"),
      status: "present"
    });
    
    this.createAttendance({
      studentId: student2.id,
      subjectAssignmentId: mathAssignment.id,
      date: new Date("2023-08-07"),
      status: "present"
    });
    
    this.createAttendance({
      studentId: student3.id,
      subjectAssignmentId: mathAssignment.id,
      date: new Date("2023-08-07"),
      status: "absent"
    });
    
    // Create tasks for teacher
    this.createTask({
      userId: teacherUser.id,
      title: "Prepare Assessment Questions",
      description: "Set assessment questions for Mathematics and Physics assessment coming up on the 20th.",
      dueDate: new Date("2023-08-10"),
      dueTime: "10:00:00"
    });
    
    this.createTask({
      userId: teacherUser.id,
      title: "Have a meeting with my Mentees",
      description: "Gather my mentees together and have a meeting with them by 12pm.",
      dueDate: new Date("2023-08-07"),
      dueTime: "11:00:00"
    });
    
    this.createTask({
      userId: teacherUser.id,
      title: "Submit Report and Comments",
      description: "Finish up my reports and comments for the term and submit.",
      dueDate: new Date("2023-08-07"),
      dueTime: "13:00:00"
    });
    
    this.createTask({
      userId: teacherUser.id,
      title: "Speak to the Maureen's Parent",
      description: "Call and schedule a meeting with Maureen's Parents.",
      dueDate: new Date("2023-08-07"),
      dueTime: "15:00:00"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date().toISOString();
    const user: User = { ...userData, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }
  
  async getPendingUsers(): Promise<User[]> {
    const pendingUsers: User[] = [];
    for (const user of this.users.values()) {
      if (user.status === "pending") {
        pendingUsers.push(user);
      }
    }
    return pendingUsers;
  }
  
  async approveUser(id: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, status: "approved" };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async rejectUser(id: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, status: "rejected" };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Student operations
  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByUserId(userId: number): Promise<Student | undefined> {
    for (const student of this.students.values()) {
      if (student.userId === userId) {
        return student;
      }
    }
    return undefined;
  }

  async getStudentsByClass(classId: number): Promise<Student[]> {
    const result: Student[] = [];
    for (const student of this.students.values()) {
      const classInfo = this.classes.get(classId);
      if (classInfo && student.yearLevel === classInfo.yearLevel && 
          student.branchId === classInfo.branchId && 
          student.sectionId === classInfo.sectionId) {
        result.push(student);
      }
    }
    return result;
  }

  async createStudent(studentData: InsertStudent): Promise<Student> {
    const id = this.studentIdCounter++;
    const student: Student = { ...studentData, id };
    this.students.set(id, student);
    return student;
  }

  async updateStudent(id: number, data: Partial<InsertStudent>): Promise<Student | undefined> {
    const student = this.students.get(id);
    if (!student) return undefined;
    
    const updatedStudent = { ...student, ...data };
    this.students.set(id, updatedStudent);
    return updatedStudent;
  }

  async deleteStudent(id: number): Promise<boolean> {
    return this.students.delete(id);
  }

  // Teacher operations
  async getTeacher(id: number): Promise<Teacher | undefined> {
    return this.teachers.get(id);
  }

  async getTeacherByUserId(userId: number): Promise<Teacher | undefined> {
    for (const teacher of this.teachers.values()) {
      if (teacher.userId === userId) {
        return teacher;
      }
    }
    return undefined;
  }

  async getAllTeachers(): Promise<Teacher[]> {
    return Array.from(this.teachers.values());
  }

  async createTeacher(teacherData: InsertTeacher): Promise<Teacher> {
    const id = this.teacherIdCounter++;
    const teacher: Teacher = { ...teacherData, id };
    this.teachers.set(id, teacher);
    return teacher;
  }

  async updateTeacher(id: number, data: Partial<InsertTeacher>): Promise<Teacher | undefined> {
    const teacher = this.teachers.get(id);
    if (!teacher) return undefined;
    
    const updatedTeacher = { ...teacher, ...data };
    this.teachers.set(id, updatedTeacher);
    return updatedTeacher;
  }

  async deleteTeacher(id: number): Promise<boolean> {
    return this.teachers.delete(id);
  }

  // Branch operations
  async getBranch(id: number): Promise<Branch | undefined> {
    return this.branches.get(id);
  }

  async getAllBranches(): Promise<Branch[]> {
    return Array.from(this.branches.values());
  }

  async createBranch(branchData: InsertBranch): Promise<Branch> {
    const id = this.branchIdCounter++;
    const branch: Branch = { ...branchData, id };
    this.branches.set(id, branch);
    return branch;
  }

  async updateBranch(id: number, data: Partial<InsertBranch>): Promise<Branch | undefined> {
    const branch = this.branches.get(id);
    if (!branch) return undefined;
    
    const updatedBranch = { ...branch, ...data };
    this.branches.set(id, updatedBranch);
    return updatedBranch;
  }

  async deleteBranch(id: number): Promise<boolean> {
    return this.branches.delete(id);
  }

  // Section operations
  async getSection(id: number): Promise<Section | undefined> {
    return this.sections.get(id);
  }

  async getAllSections(): Promise<Section[]> {
    return Array.from(this.sections.values());
  }

  async createSection(sectionData: InsertSection): Promise<Section> {
    const id = this.sectionIdCounter++;
    const section: Section = { ...sectionData, id };
    this.sections.set(id, section);
    return section;
  }

  async updateSection(id: number, data: Partial<InsertSection>): Promise<Section | undefined> {
    const section = this.sections.get(id);
    if (!section) return undefined;
    
    const updatedSection = { ...section, ...data };
    this.sections.set(id, updatedSection);
    return updatedSection;
  }

  async deleteSection(id: number): Promise<boolean> {
    return this.sections.delete(id);
  }

  // Class operations
  async getClass(id: number): Promise<Class | undefined> {
    return this.classes.get(id);
  }

  async getAllClasses(): Promise<Class[]> {
    return Array.from(this.classes.values());
  }

  async getClassesByBranch(branchId: number): Promise<Class[]> {
    const result: Class[] = [];
    for (const classEntity of this.classes.values()) {
      if (classEntity.branchId === branchId) {
        result.push(classEntity);
      }
    }
    return result;
  }

  async getClassesByYear(year: number): Promise<Class[]> {
    const result: Class[] = [];
    for (const classEntity of this.classes.values()) {
      if (classEntity.yearLevel === year) {
        result.push(classEntity);
      }
    }
    return result;
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const id = this.classIdCounter++;
    const classEntity: Class = { ...classData, id };
    this.classes.set(id, classEntity);
    return classEntity;
  }

  async updateClass(id: number, data: Partial<InsertClass>): Promise<Class | undefined> {
    const classEntity = this.classes.get(id);
    if (!classEntity) return undefined;
    
    const updatedClass = { ...classEntity, ...data };
    this.classes.set(id, updatedClass);
    return updatedClass;
  }

  async deleteClass(id: number): Promise<boolean> {
    return this.classes.delete(id);
  }

  // Subject operations
  async getSubject(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }

  async getAllSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }

  async createSubject(subjectData: InsertSubject): Promise<Subject> {
    const id = this.subjectIdCounter++;
    const subject: Subject = { ...subjectData, id };
    this.subjects.set(id, subject);
    return subject;
  }

  async updateSubject(id: number, data: Partial<InsertSubject>): Promise<Subject | undefined> {
    const subject = this.subjects.get(id);
    if (!subject) return undefined;
    
    const updatedSubject = { ...subject, ...data };
    this.subjects.set(id, updatedSubject);
    return updatedSubject;
  }

  async deleteSubject(id: number): Promise<boolean> {
    return this.subjects.delete(id);
  }

  // Subject Assignment operations
  async getSubjectAssignment(id: number): Promise<SubjectAssignment | undefined> {
    return this.subjectAssignments.get(id);
  }

  async getSubjectAssignmentsByTeacher(teacherId: number): Promise<SubjectAssignment[]> {
    const result: SubjectAssignment[] = [];
    for (const assignment of this.subjectAssignments.values()) {
      if (assignment.teacherId === teacherId) {
        result.push(assignment);
      }
    }
    return result;
  }

  async getSubjectAssignmentsByClass(classId: number): Promise<SubjectAssignment[]> {
    const result: SubjectAssignment[] = [];
    for (const assignment of this.subjectAssignments.values()) {
      if (assignment.classId === classId) {
        result.push(assignment);
      }
    }
    return result;
  }

  async getSubjectAssignmentsBySubject(subjectId: number): Promise<SubjectAssignment[]> {
    const result: SubjectAssignment[] = [];
    for (const assignment of this.subjectAssignments.values()) {
      if (assignment.subjectId === subjectId) {
        result.push(assignment);
      }
    }
    return result;
  }

  async createSubjectAssignment(assignmentData: InsertSubjectAssignment): Promise<SubjectAssignment> {
    const id = this.subjectAssignmentIdCounter++;
    const assignment: SubjectAssignment = { ...assignmentData, id };
    this.subjectAssignments.set(id, assignment);
    return assignment;
  }

  async updateSubjectAssignment(id: number, data: Partial<InsertSubjectAssignment>): Promise<SubjectAssignment | undefined> {
    const assignment = this.subjectAssignments.get(id);
    if (!assignment) return undefined;
    
    const updatedAssignment = { ...assignment, ...data };
    this.subjectAssignments.set(id, updatedAssignment);
    return updatedAssignment;
  }

  async deleteSubjectAssignment(id: number): Promise<boolean> {
    return this.subjectAssignments.delete(id);
  }

  // Attendance operations
  async getAttendance(id: number): Promise<Attendance | undefined> {
    return this.attendance.get(id);
  }

  async getAttendanceByStudentAndSubject(studentId: number, subjectAssignmentId: number): Promise<Attendance[]> {
    const result: Attendance[] = [];
    for (const attendance of this.attendance.values()) {
      if (attendance.studentId === studentId && attendance.subjectAssignmentId === subjectAssignmentId) {
        result.push(attendance);
      }
    }
    return result;
  }

  async getAttendanceByDate(date: Date): Promise<Attendance[]> {
    const dateString = date.toISOString().split('T')[0];
    const result: Attendance[] = [];
    for (const attendance of this.attendance.values()) {
      const attendanceDate = new Date(attendance.date).toISOString().split('T')[0];
      if (attendanceDate === dateString) {
        result.push(attendance);
      }
    }
    return result;
  }

  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const id = this.attendanceIdCounter++;
    const attendance: Attendance = { ...attendanceData, id };
    this.attendance.set(id, attendance);
    return attendance;
  }

  async updateAttendance(id: number, data: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const attendance = this.attendance.get(id);
    if (!attendance) return undefined;
    
    const updatedAttendance = { ...attendance, ...data };
    this.attendance.set(id, updatedAttendance);
    return updatedAttendance;
  }

  async deleteAttendance(id: number): Promise<boolean> {
    return this.attendance.delete(id);
  }

  // Assignment operations
  async getAssignment(id: number): Promise<Assignment | undefined> {
    return this.assignments.get(id);
  }

  async getAssignmentsBySubjectAssignment(subjectAssignmentId: number): Promise<Assignment[]> {
    const result: Assignment[] = [];
    for (const assignment of this.assignments.values()) {
      if (assignment.subjectAssignmentId === subjectAssignmentId) {
        result.push(assignment);
      }
    }
    return result;
  }

  async createAssignment(assignmentData: InsertAssignment): Promise<Assignment> {
    const id = this.assignmentIdCounter++;
    const createdAt = new Date().toISOString();
    const assignment: Assignment = { ...assignmentData, id, createdAt };
    this.assignments.set(id, assignment);
    return assignment;
  }

  async updateAssignment(id: number, data: Partial<InsertAssignment>): Promise<Assignment | undefined> {
    const assignment = this.assignments.get(id);
    if (!assignment) return undefined;
    
    const updatedAssignment = { ...assignment, ...data };
    this.assignments.set(id, updatedAssignment);
    return updatedAssignment;
  }

  async deleteAssignment(id: number): Promise<boolean> {
    return this.assignments.delete(id);
  }

  // Submission operations
  async getSubmission(id: number): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async getSubmissionsByAssignment(assignmentId: number): Promise<Submission[]> {
    const result: Submission[] = [];
    for (const submission of this.submissions.values()) {
      if (submission.assignmentId === assignmentId) {
        result.push(submission);
      }
    }
    return result;
  }

  async getSubmissionsByStudent(studentId: number): Promise<Submission[]> {
    const result: Submission[] = [];
    for (const submission of this.submissions.values()) {
      if (submission.studentId === studentId) {
        result.push(submission);
      }
    }
    return result;
  }

  async createSubmission(submissionData: InsertSubmission): Promise<Submission> {
    const id = this.submissionIdCounter++;
    const submittedAt = new Date().toISOString();
    const submission: Submission = { ...submissionData, id, submittedAt };
    this.submissions.set(id, submission);
    return submission;
  }

  async updateSubmission(id: number, data: Partial<InsertSubmission>): Promise<Submission | undefined> {
    const submission = this.submissions.get(id);
    if (!submission) return undefined;
    
    const updatedSubmission = { ...submission, ...data };
    this.submissions.set(id, updatedSubmission);
    return updatedSubmission;
  }

  async deleteSubmission(id: number): Promise<boolean> {
    return this.submissions.delete(id);
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesBySender(senderId: number): Promise<Message[]> {
    const result: Message[] = [];
    for (const message of this.messages.values()) {
      if (message.senderId === senderId) {
        result.push(message);
      }
    }
    return result;
  }

  async getMessagesByReceiver(receiverId: number): Promise<Message[]> {
    const result: Message[] = [];
    for (const message of this.messages.values()) {
      if (message.receiverId === receiverId) {
        result.push(message);
      }
    }
    return result;
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const sentAt = new Date().toISOString();
    const message: Message = { ...messageData, id, sentAt };
    this.messages.set(id, message);
    return message;
  }

  async updateMessage(id: number, data: Partial<InsertMessage>): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, ...data };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }

  // Announcement operations
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }

  async getAnnouncementsByUser(userId: number): Promise<Announcement[]> {
    const result: Announcement[] = [];
    for (const announcement of this.announcements.values()) {
      if (announcement.userId === userId) {
        result.push(announcement);
      }
    }
    return result;
  }

  async getAnnouncementsByRole(role: string): Promise<Announcement[]> {
    const result: Announcement[] = [];
    for (const announcement of this.announcements.values()) {
      if (announcement.targetRole === role || announcement.targetRole === "all") {
        result.push(announcement);
      }
    }
    return result;
  }

  async getAnnouncementsByClass(classId: number): Promise<Announcement[]> {
    const result: Announcement[] = [];
    for (const announcement of this.announcements.values()) {
      if (announcement.targetClassId === classId) {
        result.push(announcement);
      }
    }
    return result;
  }

  async createAnnouncement(announcementData: InsertAnnouncement): Promise<Announcement> {
    const id = this.announcementIdCounter++;
    const createdAt = new Date().toISOString();
    const announcement: Announcement = { ...announcementData, id, createdAt };
    this.announcements.set(id, announcement);
    return announcement;
  }

  async updateAnnouncement(id: number, data: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const announcement = this.announcements.get(id);
    if (!announcement) return undefined;
    
    const updatedAnnouncement = { ...announcement, ...data };
    this.announcements.set(id, updatedAnnouncement);
    return updatedAnnouncement;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    return this.announcements.delete(id);
  }

  // Resource operations
  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getResourcesByUser(userId: number): Promise<Resource[]> {
    const result: Resource[] = [];
    for (const resource of this.resources.values()) {
      if (resource.uploadedBy === userId) {
        result.push(resource);
      }
    }
    return result;
  }

  async getResourcesBySubject(subjectId: number): Promise<Resource[]> {
    const result: Resource[] = [];
    for (const resource of this.resources.values()) {
      if (resource.subjectId === subjectId) {
        result.push(resource);
      }
    }
    return result;
  }

  async createResource(resourceData: InsertResource): Promise<Resource> {
    const id = this.resourceIdCounter++;
    const createdAt = new Date().toISOString();
    const resource: Resource = { ...resourceData, id, createdAt };
    this.resources.set(id, resource);
    return resource;
  }

  async updateResource(id: number, data: Partial<InsertResource>): Promise<Resource | undefined> {
    const resource = this.resources.get(id);
    if (!resource) return undefined;
    
    const updatedResource = { ...resource, ...data };
    this.resources.set(id, updatedResource);
    return updatedResource;
  }

  async deleteResource(id: number): Promise<boolean> {
    return this.resources.delete(id);
  }

  // Student Document operations
  async getStudentDocument(id: number): Promise<StudentDocument | undefined> {
    return this.studentDocuments.get(id);
  }

  async getStudentDocumentsByStudent(studentId: number): Promise<StudentDocument[]> {
    const result: StudentDocument[] = [];
    for (const document of this.studentDocuments.values()) {
      if (document.studentId === studentId) {
        result.push(document);
      }
    }
    return result;
  }

  async createStudentDocument(documentData: InsertStudentDocument): Promise<StudentDocument> {
    const id = this.studentDocumentIdCounter++;
    const uploadedAt = new Date().toISOString();
    const document: StudentDocument = { ...documentData, id, uploadedAt };
    this.studentDocuments.set(id, document);
    return document;
  }

  async updateStudentDocument(id: number, data: Partial<InsertStudentDocument>): Promise<StudentDocument | undefined> {
    const document = this.studentDocuments.get(id);
    if (!document) return undefined;
    
    const updatedDocument = { ...document, ...data };
    this.studentDocuments.set(id, updatedDocument);
    return updatedDocument;
  }

  async deleteStudentDocument(id: number): Promise<boolean> {
    return this.studentDocuments.delete(id);
  }

  // Timetable operations
  async getTimetableEntry(id: number): Promise<Timetable | undefined> {
    return this.timetable.get(id);
  }

  async getTimetableBySubjectAssignment(subjectAssignmentId: number): Promise<Timetable[]> {
    const result: Timetable[] = [];
    for (const entry of this.timetable.values()) {
      if (entry.subjectAssignmentId === subjectAssignmentId) {
        result.push(entry);
      }
    }
    return result;
  }

  async getTimetableByDay(day: string): Promise<Timetable[]> {
    const result: Timetable[] = [];
    for (const entry of this.timetable.values()) {
      if (entry.day === day) {
        result.push(entry);
      }
    }
    return result;
  }

  async createTimetableEntry(entryData: InsertTimetable): Promise<Timetable> {
    const id = this.timetableIdCounter++;
    const entry: Timetable = { ...entryData, id };
    this.timetable.set(id, entry);
    return entry;
  }

  async updateTimetableEntry(id: number, data: Partial<InsertTimetable>): Promise<Timetable | undefined> {
    const entry = this.timetable.get(id);
    if (!entry) return undefined;
    
    const updatedEntry = { ...entry, ...data };
    this.timetable.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteTimetableEntry(id: number): Promise<boolean> {
    return this.timetable.delete(id);
  }

  // Task operations
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByUser(userId: number): Promise<Task[]> {
    const result: Task[] = [];
    for (const task of this.tasks.values()) {
      if (task.userId === userId) {
        result.push(task);
      }
    }
    return result;
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const createdAt = new Date().toISOString();
    const task: Task = { ...taskData, id, createdAt };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, data: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...data };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
}

// Temporarily use MemStorage until we resolve database connection issues
export const storage = new MemStorage();

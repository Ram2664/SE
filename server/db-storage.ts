import { IStorage } from './storage';
import { db } from './db';
import { eq, and, inArray } from 'drizzle-orm';
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";
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

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.count > 0;
  }
  
  // Student operations
  async getStudent(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async getStudentByUserId(userId: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.userId, userId));
    return student;
  }

  async getStudentsByClass(classId: number): Promise<Student[]> {
    const classData = await db.select().from(classes).where(eq(classes.id, classId)).limit(1);
    if (classData.length === 0) return [];
    
    return db.select().from(students).where(
      and(
        eq(students.yearLevel, classData[0].yearLevel),
        eq(students.branchId, classData[0].branchId),
        eq(students.sectionId, classData[0].sectionId)
      )
    );
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const [createdStudent] = await db.insert(students).values(student).returning();
    return createdStudent;
  }

  async updateStudent(id: number, data: Partial<InsertStudent>): Promise<Student | undefined> {
    const [updatedStudent] = await db.update(students)
      .set(data)
      .where(eq(students.id, id))
      .returning();
    return updatedStudent;
  }

  async deleteStudent(id: number): Promise<boolean> {
    const result = await db.delete(students).where(eq(students.id, id));
    return result.count > 0;
  }
  
  // Teacher operations
  async getTeacher(id: number): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.id, id));
    return teacher;
  }

  async getTeacherByUserId(userId: number): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.userId, userId));
    return teacher;
  }

  async getAllTeachers(): Promise<Teacher[]> {
    return db.select().from(teachers);
  }

  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    const [createdTeacher] = await db.insert(teachers).values(teacher).returning();
    return createdTeacher;
  }

  async updateTeacher(id: number, data: Partial<InsertTeacher>): Promise<Teacher | undefined> {
    const [updatedTeacher] = await db.update(teachers)
      .set(data)
      .where(eq(teachers.id, id))
      .returning();
    return updatedTeacher;
  }

  async deleteTeacher(id: number): Promise<boolean> {
    const result = await db.delete(teachers).where(eq(teachers.id, id));
    return result.count > 0;
  }
  
  // Branch operations
  async getBranch(id: number): Promise<Branch | undefined> {
    const [branch] = await db.select().from(branches).where(eq(branches.id, id));
    return branch;
  }

  async getAllBranches(): Promise<Branch[]> {
    return db.select().from(branches);
  }

  async createBranch(branch: InsertBranch): Promise<Branch> {
    const [createdBranch] = await db.insert(branches).values(branch).returning();
    return createdBranch;
  }

  async updateBranch(id: number, data: Partial<InsertBranch>): Promise<Branch | undefined> {
    const [updatedBranch] = await db.update(branches)
      .set(data)
      .where(eq(branches.id, id))
      .returning();
    return updatedBranch;
  }

  async deleteBranch(id: number): Promise<boolean> {
    const result = await db.delete(branches).where(eq(branches.id, id));
    return result.count > 0;
  }
  
  // Section operations
  async getSection(id: number): Promise<Section | undefined> {
    const [section] = await db.select().from(sections).where(eq(sections.id, id));
    return section;
  }

  async getAllSections(): Promise<Section[]> {
    return db.select().from(sections);
  }

  async createSection(section: InsertSection): Promise<Section> {
    const [createdSection] = await db.insert(sections).values(section).returning();
    return createdSection;
  }

  async updateSection(id: number, data: Partial<InsertSection>): Promise<Section | undefined> {
    const [updatedSection] = await db.update(sections)
      .set(data)
      .where(eq(sections.id, id))
      .returning();
    return updatedSection;
  }

  async deleteSection(id: number): Promise<boolean> {
    const result = await db.delete(sections).where(eq(sections.id, id));
    return result.count > 0;
  }
  
  // Class operations
  async getClass(id: number): Promise<Class | undefined> {
    const [classEntity] = await db.select().from(classes).where(eq(classes.id, id));
    return classEntity;
  }

  async getAllClasses(): Promise<Class[]> {
    return db.select().from(classes);
  }

  async getClassesByBranch(branchId: number): Promise<Class[]> {
    return db.select().from(classes).where(eq(classes.branchId, branchId));
  }

  async getClassesByYear(year: number): Promise<Class[]> {
    return db.select().from(classes).where(eq(classes.yearLevel, year));
  }

  async createClass(classEntity: InsertClass): Promise<Class> {
    const [createdClass] = await db.insert(classes).values(classEntity).returning();
    return createdClass;
  }

  async updateClass(id: number, data: Partial<InsertClass>): Promise<Class | undefined> {
    const [updatedClass] = await db.update(classes)
      .set(data)
      .where(eq(classes.id, id))
      .returning();
    return updatedClass;
  }

  async deleteClass(id: number): Promise<boolean> {
    const result = await db.delete(classes).where(eq(classes.id, id));
    return result.count > 0;
  }
  
  // Subject operations
  async getSubject(id: number): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, id));
    return subject;
  }

  async getAllSubjects(): Promise<Subject[]> {
    return db.select().from(subjects);
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [createdSubject] = await db.insert(subjects).values(subject).returning();
    return createdSubject;
  }

  async updateSubject(id: number, data: Partial<InsertSubject>): Promise<Subject | undefined> {
    const [updatedSubject] = await db.update(subjects)
      .set(data)
      .where(eq(subjects.id, id))
      .returning();
    return updatedSubject;
  }

  async deleteSubject(id: number): Promise<boolean> {
    const result = await db.delete(subjects).where(eq(subjects.id, id));
    return result.count > 0;
  }
  
  // Subject Assignment operations
  async getSubjectAssignment(id: number): Promise<SubjectAssignment | undefined> {
    const [assignment] = await db.select().from(subjectAssignments).where(eq(subjectAssignments.id, id));
    return assignment;
  }

  async getSubjectAssignmentsByTeacher(teacherId: number): Promise<SubjectAssignment[]> {
    return db.select().from(subjectAssignments).where(eq(subjectAssignments.teacherId, teacherId));
  }

  async getSubjectAssignmentsByClass(classId: number): Promise<SubjectAssignment[]> {
    return db.select().from(subjectAssignments).where(eq(subjectAssignments.classId, classId));
  }

  async getSubjectAssignmentsBySubject(subjectId: number): Promise<SubjectAssignment[]> {
    return db.select().from(subjectAssignments).where(eq(subjectAssignments.subjectId, subjectId));
  }

  async createSubjectAssignment(assignment: InsertSubjectAssignment): Promise<SubjectAssignment> {
    const [createdAssignment] = await db.insert(subjectAssignments).values(assignment).returning();
    return createdAssignment;
  }

  async updateSubjectAssignment(id: number, data: Partial<InsertSubjectAssignment>): Promise<SubjectAssignment | undefined> {
    const [updatedAssignment] = await db.update(subjectAssignments)
      .set(data)
      .where(eq(subjectAssignments.id, id))
      .returning();
    return updatedAssignment;
  }

  async deleteSubjectAssignment(id: number): Promise<boolean> {
    const result = await db.delete(subjectAssignments).where(eq(subjectAssignments.id, id));
    return result.count > 0;
  }
  
  // Attendance operations
  async getAttendance(id: number): Promise<Attendance | undefined> {
    const [attendance] = await db.select().from(attendance).where(eq(attendance.id, id));
    return attendance;
  }

  async getAttendanceByStudentAndSubject(studentId: number, subjectAssignmentId: number): Promise<Attendance[]> {
    return db.select().from(attendance).where(
      and(
        eq(attendance.studentId, studentId),
        eq(attendance.subjectAssignmentId, subjectAssignmentId)
      )
    );
  }

  async getAttendanceByDate(date: Date): Promise<Attendance[]> {
    return db.select().from(attendance).where(eq(attendance.date, date));
  }

  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const [createdAttendance] = await db.insert(attendance).values(attendanceData).returning();
    return createdAttendance;
  }

  async updateAttendance(id: number, data: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const [updatedAttendance] = await db.update(attendance)
      .set(data)
      .where(eq(attendance.id, id))
      .returning();
    return updatedAttendance;
  }

  async deleteAttendance(id: number): Promise<boolean> {
    const result = await db.delete(attendance).where(eq(attendance.id, id));
    return result.count > 0;
  }
  
  // Assignment operations
  async getAssignment(id: number): Promise<Assignment | undefined> {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment;
  }

  async getAssignmentsBySubjectAssignment(subjectAssignmentId: number): Promise<Assignment[]> {
    return db.select().from(assignments).where(eq(assignments.subjectAssignmentId, subjectAssignmentId));
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const [createdAssignment] = await db.insert(assignments).values(assignment).returning();
    return createdAssignment;
  }

  async updateAssignment(id: number, data: Partial<InsertAssignment>): Promise<Assignment | undefined> {
    const [updatedAssignment] = await db.update(assignments)
      .set(data)
      .where(eq(assignments.id, id))
      .returning();
    return updatedAssignment;
  }

  async deleteAssignment(id: number): Promise<boolean> {
    const result = await db.delete(assignments).where(eq(assignments.id, id));
    return result.count > 0;
  }
  
  // Submission operations
  async getSubmission(id: number): Promise<Submission | undefined> {
    const [submission] = await db.select().from(submissions).where(eq(submissions.id, id));
    return submission;
  }

  async getSubmissionsByAssignment(assignmentId: number): Promise<Submission[]> {
    return db.select().from(submissions).where(eq(submissions.assignmentId, assignmentId));
  }

  async getSubmissionsByStudent(studentId: number): Promise<Submission[]> {
    return db.select().from(submissions).where(eq(submissions.studentId, studentId));
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [createdSubmission] = await db.insert(submissions).values(submission).returning();
    return createdSubmission;
  }

  async updateSubmission(id: number, data: Partial<InsertSubmission>): Promise<Submission | undefined> {
    const [updatedSubmission] = await db.update(submissions)
      .set(data)
      .where(eq(submissions.id, id))
      .returning();
    return updatedSubmission;
  }

  async deleteSubmission(id: number): Promise<boolean> {
    const result = await db.delete(submissions).where(eq(submissions.id, id));
    return result.count > 0;
  }
  
  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async getMessagesBySender(senderId: number): Promise<Message[]> {
    return db.select().from(messages).where(eq(messages.senderId, senderId));
  }

  async getMessagesByReceiver(receiverId: number): Promise<Message[]> {
    return db.select().from(messages).where(eq(messages.receiverId, receiverId));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [createdMessage] = await db.insert(messages).values(message).returning();
    return createdMessage;
  }

  async updateMessage(id: number, data: Partial<InsertMessage>): Promise<Message | undefined> {
    const [updatedMessage] = await db.update(messages)
      .set(data)
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage;
  }

  async deleteMessage(id: number): Promise<boolean> {
    const result = await db.delete(messages).where(eq(messages.id, id));
    return result.count > 0;
  }
  
  // Announcement operations
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    return announcement;
  }

  async getAnnouncementsByUser(userId: number): Promise<Announcement[]> {
    return db.select().from(announcements).where(eq(announcements.userId, userId));
  }

  async getAnnouncementsByRole(role: string): Promise<Announcement[]> {
    return db.select().from(announcements).where(eq(announcements.targetRole, role));
  }

  async getAnnouncementsByClass(classId: number): Promise<Announcement[]> {
    return db.select().from(announcements).where(eq(announcements.targetClassId, classId));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [createdAnnouncement] = await db.insert(announcements).values(announcement).returning();
    return createdAnnouncement;
  }

  async updateAnnouncement(id: number, data: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const [updatedAnnouncement] = await db.update(announcements)
      .set(data)
      .where(eq(announcements.id, id))
      .returning();
    return updatedAnnouncement;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const result = await db.delete(announcements).where(eq(announcements.id, id));
    return result.count > 0;
  }
  
  // Resource operations
  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async getResourcesByUser(userId: number): Promise<Resource[]> {
    return db.select().from(resources).where(eq(resources.uploadedBy, userId));
  }

  async getResourcesBySubject(subjectId: number): Promise<Resource[]> {
    return db.select().from(resources).where(eq(resources.subjectId, subjectId));
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [createdResource] = await db.insert(resources).values(resource).returning();
    return createdResource;
  }

  async updateResource(id: number, data: Partial<InsertResource>): Promise<Resource | undefined> {
    const [updatedResource] = await db.update(resources)
      .set(data)
      .where(eq(resources.id, id))
      .returning();
    return updatedResource;
  }

  async deleteResource(id: number): Promise<boolean> {
    const result = await db.delete(resources).where(eq(resources.id, id));
    return result.count > 0;
  }
  
  // Student Document operations
  async getStudentDocument(id: number): Promise<StudentDocument | undefined> {
    const [document] = await db.select().from(studentDocuments).where(eq(studentDocuments.id, id));
    return document;
  }

  async getStudentDocumentsByStudent(studentId: number): Promise<StudentDocument[]> {
    return db.select().from(studentDocuments).where(eq(studentDocuments.studentId, studentId));
  }

  async createStudentDocument(document: InsertStudentDocument): Promise<StudentDocument> {
    const [createdDocument] = await db.insert(studentDocuments).values(document).returning();
    return createdDocument;
  }

  async updateStudentDocument(id: number, data: Partial<InsertStudentDocument>): Promise<StudentDocument | undefined> {
    const [updatedDocument] = await db.update(studentDocuments)
      .set(data)
      .where(eq(studentDocuments.id, id))
      .returning();
    return updatedDocument;
  }

  async deleteStudentDocument(id: number): Promise<boolean> {
    const result = await db.delete(studentDocuments).where(eq(studentDocuments.id, id));
    return result.count > 0;
  }
  
  // Timetable operations
  async getTimetableEntry(id: number): Promise<Timetable | undefined> {
    const [entry] = await db.select().from(timetable).where(eq(timetable.id, id));
    return entry;
  }

  async getTimetableBySubjectAssignment(subjectAssignmentId: number): Promise<Timetable[]> {
    return db.select().from(timetable).where(eq(timetable.subjectAssignmentId, subjectAssignmentId));
  }

  async getTimetableByDay(day: string): Promise<Timetable[]> {
    return db.select().from(timetable).where(eq(timetable.day, day));
  }

  async createTimetableEntry(entry: InsertTimetable): Promise<Timetable> {
    const [createdEntry] = await db.insert(timetable).values(entry).returning();
    return createdEntry;
  }

  async updateTimetableEntry(id: number, data: Partial<InsertTimetable>): Promise<Timetable | undefined> {
    const [updatedEntry] = await db.update(timetable)
      .set(data)
      .where(eq(timetable.id, id))
      .returning();
    return updatedEntry;
  }

  async deleteTimetableEntry(id: number): Promise<boolean> {
    const result = await db.delete(timetable).where(eq(timetable.id, id));
    return result.count > 0;
  }
  
  // Task operations
  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async getTasksByUser(userId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [createdTask] = await db.insert(tasks).values(task).returning();
    return createdTask;
  }

  async updateTask(id: number, data: Partial<InsertTask>): Promise<Task | undefined> {
    const [updatedTask] = await db.update(tasks)
      .set(data)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.count > 0;
  }

  // User approval operations
  async getPendingUsers(): Promise<User[]> {
    return db.select().from(users).where(eq(users.status, 'pending'));
  }

  async approveUser(id: number): Promise<User | undefined> {
    return this.updateUser(id, { status: 'approved' });
  }

  async rejectUser(id: number): Promise<User | undefined> {
    return this.updateUser(id, { status: 'rejected' });
  }
}
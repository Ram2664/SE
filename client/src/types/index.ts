// User Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'teacher' | 'student';
  profileImage?: string;
  createdAt: string;
  student?: Student;
  teacher?: Teacher;
}

export interface Student {
  id: number;
  userId: number;
  studentId: string;
  yearLevel: number;
  branchId: number;
  sectionId: number;
  documents?: Record<string, any>;
}

export interface Teacher {
  id: number;
  userId: number;
  teacherId: string;
  specialization?: string;
}

// Academic Structure Types
export interface Branch {
  id: number;
  name: string;
  description?: string;
}

export interface Section {
  id: number;
  name: string;
}

export interface Class {
  id: number;
  yearLevel: number;
  branchId: number;
  sectionId: number;
  name: string;
  branch?: Branch;
  section?: Section;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface SubjectAssignment {
  id: number;
  teacherId: number;
  subjectId: number;
  classId: number;
  teacher?: Teacher & { user?: Partial<User> };
  subject?: Subject;
  class?: Class;
}

// Educational Content Types
export interface Assignment {
  id: number;
  title: string;
  description?: string;
  subjectAssignmentId: number;
  dueDate?: string;
  maxMarks?: number;
  resourceUrl?: string;
  createdAt: string;
}

export interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  submissionUrl?: string;
  submittedAt: string;
  marks?: number;
  feedback?: string;
  status: 'draft' | 'submitted' | 'marked';
}

export interface Attendance {
  id: number;
  studentId: number;
  subjectAssignmentId: number;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

// Communication Types
export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  read: boolean;
  sentAt: string;
}

export interface Announcement {
  id: number;
  userId: number;
  title: string;
  content: string;
  targetRole?: string;
  targetClassId?: number;
  createdAt: string;
}

// Resource Types
export interface Resource {
  id: number;
  name: string;
  description?: string;
  url: string;
  type?: string;
  uploadedBy: number;
  subjectId?: number;
  createdAt: string;
}

export interface StudentDocument {
  id: number;
  studentId: number;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

// Schedule Types
export interface Timetable {
  id: number;
  subjectAssignmentId: number;
  day: string;
  startTime: string;
  endTime: string;
  room?: string;
  subjectAssignment?: SubjectAssignment & {
    subject?: Subject;
    class?: Class;
  };
}

export interface Task {
  id: number;
  userId: number;
  title: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  completed: boolean;
  createdAt: string;
}

// Chart and Stats Types
export interface AssignmentStats {
  totalStudents: number;
  assigned: number;
  submitted: number;
  notSubmitted: number;
  marked: number;
  notMarked: number;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  total: number;
}

export interface StudentPerformanceItem {
  student: Student & { user: Pick<User, 'firstName' | 'lastName' | 'profileImage'> };
  percentage: number;
}

export interface CalendarDay {
  date: number;
  events?: Task[];
  isToday?: boolean;
  isCurrentMonth: boolean;
}

export interface PlannerMonth {
  name: string;
  days: CalendarDay[];
}

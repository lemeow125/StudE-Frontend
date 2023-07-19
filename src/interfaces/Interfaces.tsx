export interface IconProps {
  size: number;
}

export interface ResponsiveIconProps {
  size: number;
  color: string;
}

export interface RootDrawerParamList {
  navigate: any;
}

// Redux Interfaces
export interface LoginState {
  Login: { logged_in: boolean };
}

export interface LoggedInUserState {
  LoggedInUser: {
    value: {
      email: string;
      id: number;
      username: string;
    };
  };
}

// API Interfaces

export interface RegistrationParams {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  student_id_number: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface ActivationParams {
  uid: string;
  token: string;
}

export interface OptionType {
  label: string;
  value: string;
}

// Semester
export interface Semester {
  id: string;
  name: string;
  shortname: string;
}

export type Semesters = Array<Semester>;

export type SemesterParams = [boolean, Semesters];

// Year Level
export interface YearLevel {
  id: string;
  name: string;
  shortname: string;
}

export type YearLevels = Array<YearLevel>;

export type YearLevelParams = [boolean, YearLevels];

// Course
export interface Course {
  id: string;
  name: string;
  shortname: string;
}
export type Courses = Array<Course>;
export type CourseParams = [boolean, Courses];

// Subject
export interface Subject {
  name: string;
  code: string;
  // courses: any[]; // To-do
  // year_levels: any[]; // To-do
  // semesters: any[]; // To-do
}

export type Subjects = Array<Subject>;
export type SubjectParams = [boolean, Subjects];

// For dropdown menu

export interface OnboardingParams {
  year_level: string;
  course: string;
  semester: string;
}

export interface PatchStudentData {
  course?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  semester?: string | null;
  subjects?: any[] | null; // To-do, replace 'any' with your actual type
  year_level?: string | null;
}

export interface StudentData {
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  student_id_number: string;
  is_banned: boolean;
  semester: string;
  semester_shortname: string;
  course: string;
  course_shortname: string;
  year_level: string;
  yearlevel_shortname: string;
  subjects: any[]; // To-do
  username: string;
}

export type UserInfoParams = [boolean, StudentData];

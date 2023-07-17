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

export interface Semester {
  id: string;
  name: string;
  shortname: string;
}

export type Semesters = Array<Semester>;

export type SemesterParams = [boolean, Semesters];

export interface YearLevel {
  id: string;
  name: string;
  shortname: string;
}

export type YearLevelParams = [boolean, YearLevel];

export interface Course {
  id: string;
  name: string;
  shortname: string;
}

export type CourseParams = [boolean, Course];

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
  avatar: string;
  course: string;
  email: string;
  first_name: string;
  is_banned: boolean;
  last_name: string;
  semester: string;
  student_id_number: string;
  subjects: any[]; // To-do
  username: string;
  year_level: string;
}

export type UserInfoParams = [boolean, StudentData];

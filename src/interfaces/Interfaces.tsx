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

export interface SemesterParams {
  id: string;
  name: string;
  shortname: string;
}

export interface YearLevelParams {
  id: string;
  name: string;
  shortname: string;
}

export interface CourseParams {
  id: string;
  name: string;
  shortname: string;
}

export interface OnboardingParams {
  year_level: string;
  course: string;
  semester: string;
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
  user_status: {
    active: boolean;
    landmark: string;
    location: any; // To-do
    study_group: any[]; // To-do
    subject: string;
    timestamp: string;
    user: string;
  };
  username: string;
  year_level: string;
}

export type UserInfoParams = [boolean, StudentData];

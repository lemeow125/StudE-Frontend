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

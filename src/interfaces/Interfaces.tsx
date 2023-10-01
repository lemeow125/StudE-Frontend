import * as Location from "expo-location";
import { GetStudentStatus } from "../components/Api/Api";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export interface IconProps {
  size: number;
}

export interface ResponsiveIconProps {
  size: number;
  color: string;
}

export interface RootDrawerParamList {
  navigate: any;
  replace: any;
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

export interface RegistrationType {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  student_id_number: string;
}

export interface LoginType {
  username: string;
  password: string;
}

export interface ActivationType {
  uid: string;
  token: string;
}

export interface OptionType {
  label: string;
  value: string;
}

// Semester
export interface SemesterType {
  id: string;
  name: string;
  shortname: string;
}

export type SemestersType = Array<SemesterType>;

export type SemesterReturnType = [boolean, SemestersType];

// Year Level
export interface YearLevelType {
  id: string;
  name: string;
  shortname: string;
}

export type YearLevelsType = Array<YearLevelType>;

export type YearLevelReturnType = [boolean, YearLevelsType];

// Course
export interface CourseType {
  id: string;
  name: string;
  shortname: string;
}
export type CoursesType = Array<CourseType>;
export type CourseReturnType = [boolean, CoursesType];

// Subject
export interface SubjectType {
  id: number;
  name: string;
  code: string;
  course: string;
  year_level: string;
  semester: string;
}

export type SubjectsType = Array<SubjectType>;
export type SubjectsReturnType = [boolean, SubjectsType];

export type AvatarType = {
  uri: string;
  type: string;
  name: string;
};
// For dropdown menu

export interface OnboardingType {
  year_level: string;
  course: string;
  semester: string;
}

export interface PatchUserInfoType {
  course?: string;
  first_name?: string;
  last_name?: string;
  semester?: string;
  subjects?: string[];
  year_level?: string;
  irregular?: boolean;
  avatar?: string;
}

export interface LocationType {
  latitude: Float;
  longitude: Float;
}

export interface StudentStatusType {
  subject: string;
  location: LocationType;
  landmark: string | null;
  active: boolean;
  study_group: string;
}

export interface StudentStatusPatchType {
  subject?: string;
  location?: LocationType;
  landmark?: string | null;
  active?: boolean;
  study_group?: string;
}

export interface StudentStatusFilterType {
  active: boolean;
  distance: number;
  landmark: string | null;
  location: LocationType;
  study_group?: string;
  subject: string;
  user: string;
  weight?: number;
}

export interface StudentStatusFilterTypeFlattened {
  active: boolean;
  distance: number;
  landmark: string | null;
  latitude: Float;
  longitude: Float;
  study_group?: string;
  subject: string;
  user: string;
  weight?: number;
}

export interface StudyGroupType {
  name: string;
  students: string[];
  distance: number;
  landmark: string | null;
  location: LocationType;
  subject: string;
  radius: number;
}

export interface StudyGroupCreateType {
  name: string;
  location: LocationType;
  subject: string;
}

export interface MessageType {
  id: number;
  user: string;
  study_group: string;
  message_content: string;
  timestamp: string;
}

export interface MessagePostType {
  message_content: string;
}

export interface GroupMessageAvatarType {
  username: string;
  avatar: string;
}

export type GroupMessageAvatarListType = GroupMessageAvatarType[];
export type GroupMessageAvatarReturnType = [boolean, GroupMessageAvatarType[]];
export type MessageReturnType = [boolean, MessageType[]];
export type StudyGroupDetailReturnType = [boolean, StudyGroupType];
export type StudyGroupReturnType = [boolean, StudyGroupType[]];
export type StudentStatusReturnType = [boolean, StudentStatusType];
export type StudentStatusListType = Array<StudentStatusFilterType>;
export type StudentStatusListReturnType = [boolean, StudentStatusListType];
export type RawLocationType = Location.LocationObject;

export interface UserInfoType {
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  student_id_number: string;
  irregular: boolean;
  semester: string;
  semester_shortname: string;
  course: string;
  course_shortname: string;
  year_level: string;
  yearlevel_shortname: string;
  subjects: string[];
  username: string;
}

export type UserInfoReturnType = [boolean, UserInfoType];

export type subjectUserMapType = {
  subject: string;
  users: string[];
  latitude: Float;
  longitude: Float;
  radius: Float;
};

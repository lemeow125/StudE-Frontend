import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivationType,
  LocationType,
  LoginType,
  MessagePostType,
  OnboardingType,
  PatchUserInfoType,
  RegistrationType,
  StudentStatusPatchType,
  StudentStatusType,
  StudyGroupCreateType,
  StudyGroupType,
} from "../../interfaces/Interfaces";

export let backendURL = "https://stude.keannu1.duckdns.org";
export let backendURLWebsocket = "ws://stude.keannu1.duckdns.org";
if (__DEV__) {
  backendURL = "http://10.0.10.8:8083";
  backendURLWebsocket = "ws://10.0.10.8:8083";
}

// Switch this on if you wanna run production URLs while in development
let use_production = true;
if (__DEV__ && use_production) {
  backendURL = "https://stude.keannu1.duckdns.org";
  backendURLWebsocket = "ws://stude.keannu1.duckdns.org";
}

const instance = axios.create({
  baseURL: backendURL,
  timeout: 1000,
});

console.log("Using backend API:", backendURL);

// 3rd Party APIs
export const urlProvider =
  "https://openstreetmap.keannu1.duckdns.org/tile/{z}/{x}/{y}.png?";
// App APIs

// Error Handling
export function ParseError(error: any) {
  if (error.response && error.response.data) {
    return JSON.stringify(error.response.data)
      .replaceAll(/[{}()"]/g, " ")
      .replaceAll(/,/g, "\n")
      .replaceAll("[", "")
      .replaceAll("]", "")
      .replaceAll(".", "")
      .replaceAll(/"/g, "")
      .replaceAll("non_field_errors", "")
      .trim();
  }
  return "Unable to reach server";
}

// Token Handling
export async function getAccessToken() {
  const accessToken = await AsyncStorage.getItem("access_token");
  return accessToken;
}

export async function getRefreshToken() {
  const refreshToken = await AsyncStorage.getItem("refresh_token");
  return refreshToken;
}

export async function setAccessToken(access: string) {
  await AsyncStorage.setItem("access_token", access);
  return true;
}

export async function setRefreshToken(refresh: string) {
  await AsyncStorage.setItem("refresh_token", refresh);
  return true;
}

// Header Config Template for REST
export async function GetConfig() {
  const accessToken = await getAccessToken();
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

// User APIs
export function UserRegister(register: RegistrationType) {
  return instance
    .post("/api/v1/accounts/users/", register)
    .then(async (response) => {
      return [true, response.status];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export function UserLogin(user: LoginType) {
  return instance
    .post("/api/v1/accounts/jwt/create/", user)
    .then(async (response) => {
      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);
      return [true];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function TokenRefresh() {
  const refresh = await getRefreshToken();
  // console.log("Refresh token", refresh);
  return instance
    .post("/api/v1/accounts/jwt/refresh/", {
      refresh: refresh,
    })
    .then(async (response) => {
      setAccessToken(response.data.access);
      return true;
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return false;
    });
}
export async function GetUserInfo() {
  const config = await GetConfig();
  return instance
    .get("/api/v1/accounts/users/me/", config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function PatchUserInfo(info: PatchUserInfoType) {
  const config = await GetConfig();
  return instance
    .patch("/api/v1/accounts/users/me/", info, config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export function UserActivate(activation: ActivationType) {
  return instance
    .post("/api/v1/accounts/users/activation/", activation)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}

// App APIs

export async function GetCourses() {
  const accessToken = await getAccessToken();
  return instance
    .get("/api/v1/courses/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function GetSemesters() {
  const accessToken = await getAccessToken();
  return instance
    .get("/api/v1/semesters/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function GetYearLevels() {
  const config = await GetConfig();
  return instance
    .get("/api/v1/year_levels/", config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function GetSubjects() {
  const config = await GetConfig();
  return instance
    .get("/api/v1/subjects/", config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function GetStudentStatus() {
  const config = await GetConfig();
  return instance
    .get("/api/v1/student_status/self/", config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function PatchStudentStatus(info: StudentStatusPatchType) {
  const config = await GetConfig();
  return instance
    .patch("/api/v1/student_status/self/", info, config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function GetStudentStatusList() {
  const config = await GetConfig();
  return instance
    .get("/api/v1/student_status/list/", config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function GetStudentStatusListNear() {
  const config = await GetConfig();
  return instance
    .get("/api/v1/student_status/near/", config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

// To-do
export async function GetStudentStatusListFilteredCurrentLocation(
  location: LocationType
) {
  const config = await GetConfig();
  return instance
    .post(
      "/api/v1/student_status/near_current_location/",
      {
        location: location,
      },
      config
    )
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function GetStudyGroupListFiltered() {
  const config = await GetConfig();
  return instance
    .get("/api/v1/study_groups/near/", config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function GetStudyGroupList() {
  const config = await GetConfig();
  return instance
    .get("/api/v1/study_groups/", config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function CreateStudyGroup(info: StudyGroupCreateType) {
  const config = await GetConfig();
  // console.log("Creating study group:", info);
  return instance
    .post("/api/v1/study_groups/create/", info, config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function GetStudyGroup(name: string) {
  const config = await GetConfig();
  return instance
    .get(`/api/v1/study_groups/${name}`, config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function GetStudyGroupMessages() {
  const config = await GetConfig();
  return instance
    .get(`/api/v1/messages/`, config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function GetStudyGroupMemberAvatars() {
  const config = await GetConfig();
  return instance
    .get(`/api/v1/study_groups/member_avatars`, config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

export async function PostMessage(info: MessagePostType) {
  const config = await GetConfig();
  return instance
    .post(`/api/v1/messages/`, info, config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      console.log("Error:", error.response.data);
      let error_message = ParseError(error);
      return [false, error_message];
    });
}

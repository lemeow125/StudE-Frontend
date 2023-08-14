import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivationParams,
  LoginParams,
  OnboardingParams,
  PatchStudentData,
  RegistrationParams,
  StudentStatus,
} from "../../interfaces/Interfaces";

export let backendURL = "https://stude.keannu1.duckdns.org";
export let backendURLWebsocket = "ws://stude.keannu1.duckdns.org";
if (__DEV__) {
  backendURL = "http://10.0.10.8:8000";
  backendURLWebsocket = "ws://10.0.10.8:8000";
}

// Switch this on if you wanna run production URLs while in development
let use_production = false;
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
  "https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=0f5cb5930d7642a8a921daea650754d9";
// App APIs

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
export function UserRegister(register: RegistrationParams) {
  console.log(JSON.stringify(register));
  return instance
    .post("/api/v1/accounts/users/", register)
    .then(async (response) => {
      return [true, response.status];
    })
    .catch((error) => {
      let error_message = "";
      if (error.response) error_message = error.response.data;
      else error_message = "Unable to reach servers";
      return [false, error_message];
    });
}

export function UserLogin(user: LoginParams) {
  return instance
    .post("/api/v1/accounts/jwt/create/", user)
    .then(async (response) => {
      /*console.log(
        "Access Token:",
        response.data.access,
        "\nRefresh Token:",
        response.data.refresh
      );*/
      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);
      return [true];
    })
    .catch((error) => {
      let error_message = "";
      if (error.response) error_message = error.response.data;
      else error_message = "Unable to reach servers";
      // console.log(error_message);
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
      /*console.log(
        "Token refresh success! New Access Token",
        response.data.access
      );*/
      return true;
    })
    .catch((error) => {
      let error_message = "";
      if (error.response) error_message = error.response.data;
      else error_message = "Unable to reach servers";
      console.log("Token Refresh error:", error_message);
      return false;
    });
}
export async function UserInfo() {
  const config = await GetConfig();
  return instance
    .get("/api/v1/accounts/users/me/", config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = "";
      if (error.response) error_message = error.response.data;
      else error_message = "Unable to reach servers";
      return [false, error_message];
    });
}

export async function PatchUserInfo(info: PatchStudentData) {
  const config = await GetConfig();
  return instance
    .patch("/api/v1/accounts/users/me/", info, config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = "";
      if (error.response) error_message = error.response.data;
      else error_message = "Unable to reach servers";
      return [false, error_message];
    });
}

export function UserActivate(activation: ActivationParams) {
  return instance
    .post("/api/v1/accounts/users/activation/", activation)
    .then(async (response) => {
      return true;
    })
    .catch((error) => {
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
      let error_message = "";
      if (error.response) error_message = error.response.data;
      else error_message = "Unable to reach servers";
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
      let error_message = "";
      if (error.response) error_message = error.response.data;
      else error_message = "Unable to reach servers";
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
      let error_message = "";
      if (error.response) error_message = error.response.data;
      else error_message = "Unable to reach servers";
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
      let error_message = "";
      if (error.response) error_message = error.response.data;
      else error_message = "Unable to reach servers";
      return [false, error_message];
    });
}

export async function OnboardingUpdateStudentInfo(info: OnboardingParams) {
  const config = await GetConfig();
  return instance
    .patch("/api/v1/accounts/users/me/", info, config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = "";
      if (error.response) error_message = error.response.data;
      else error_message = "Unable to reach servers";
      console.log("Error updating onboarding info", error_message);
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
      let error_message = "";
      if (error.response) error_message = error.response.data;
      else error_message = "Unable to reach servers";
      console.log(error_message);
      return [false, error_message];
    });
}

export async function PatchStudentStatus(info: StudentStatus) {
  const config = await GetConfig();
  console.log(info);
  return instance
    .patch("/api/v1/student_status/self/", info, config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      let error_message = "";
      if (error.response) error_message = error.response.data;
      else error_message = "Unable to reach servers";
      console.log(error_message);
      return [false, error_message];
    });
}

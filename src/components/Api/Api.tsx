import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivationParams,
  LoginParams,
  RegistrationParams,
} from "../../interfaces/Interfaces";

let debug = true;
export let backendURL = "";
if (debug) {
  backendURL = "http://10.0.10.8:8000";
} else {
  backendURL = "https://keannu125.pythonanywhere.com";
}

const instance = axios.create({
  baseURL: backendURL,
  timeout: 1000,
});

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

// User APIs
export function UserRegister(register: RegistrationParams) {
  console.log(JSON.stringify(register));
  return instance
    .post("/api/v1/accounts/users/", register)
    .then(async (response) => {
      return [response.status];
    })
    .catch((error) => {
      return [error.response.status, error.response.data];
    });
}

export function UserLogin(user: LoginParams) {
  return instance
    .post("/api/v1/accounts/jwt/create/", user)
    .then(async (response) => {
      console.log(
        "Access Token:",
        response.data.access,
        "\nRefresh Token:",
        response.data.refresh
      );
      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);
      return [
        true,
        JSON.stringify(response.data.access),
        JSON.stringify(response.data.refresh),
      ];
    })
    .catch((error) => {
      console.log("Login Failed:" + error.response.data);
      return [false, error.response.data];
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
      return [true, getAccessToken()];
    })
    .catch((error) => {
      console.log("Refresh Failed: " + JSON.stringify(error.response.data));
      return [false, error.response.data];
    });
}
export async function UserInfo() {
  const accessToken = await getAccessToken();
  return instance
    .get("/api/v1/accounts/users/me/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log("User Info Error", error.response.data);
      return [false, error.response.data];
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

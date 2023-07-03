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
      console.log(response.data.access, response.data.refresh);
      AsyncStorage.setItem(
        "access_token",
        JSON.stringify(response.data.access)
      );
      AsyncStorage.setItem(
        "refresh_token",
        JSON.stringify(response.data.refresh)
      );
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

export function TokenRefresh(token: string) {
  return instance
    .post("/api/v1/accounts/jwt/refresh/", token)
    .then(async (response) => {
      AsyncStorage.setItem("token", JSON.stringify(response.data.auth_token));
      return true;
    })
    .catch((error) => {
      console.log("Login Failed: " + error);
      return false;
    });
}
export async function UserInfo() {
  const token = JSON.parse((await AsyncStorage.getItem("token")) || "{}");
  return instance
    .get("/api/v1/accounts/users/me/", {
      headers: {
        Authorization: "Token " + token,
      },
    })
    .then((response) => {
      return response.data;
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

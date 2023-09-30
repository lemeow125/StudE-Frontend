import * as React from "react";
import styles from "../../styles";
import { View, Text, ActivityIndicator } from "react-native";
import { TokenRefresh, GetUserInfo } from "../../components/Api/Api";
import { useDispatch } from "react-redux";
import { colors } from "../../styles";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootDrawerParamList } from "../../interfaces/Interfaces";
import {
  login,
  unsetOnboarding,
} from "../../features/redux/slices/StatusSlice/StatusSlice";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import { setUser } from "../../features/redux/slices/UserSlice/UserSlice";
import { setOnboarding } from "../../features/redux/slices/StatusSlice/StatusSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";

export default function Revalidation() {
  const dispatch = useDispatch();
  const navigation = useNavigation<RootDrawerParamList>();
  const [state, setState] = useState("Checking for existing session");
  const toast = useToast();
  useEffect(() => {
    setState("Previous session found");
    TokenRefresh().then(async (response) => {
      let user_info = await GetUserInfo();
      if (response && user_info[0]) {
        dispatch(login());
        dispatch(setUser(user_info[1]));
        if (
          !user_info[1].year_level ||
          !user_info[1].course ||
          !user_info[1].semester
        ) {
          dispatch(setOnboarding());
          toast.show("Previous session restored", {
            type: "success",
            placement: "top",
            duration: 2000,
            animationType: "slide-in",
          });
          await setTimeout(() => {
            navigation.navigate("Onboarding");
          }, 700);
        } else {
          dispatch(unsetOnboarding());
          toast.show("Previous session restored", {
            type: "success",
            placement: "top",
            duration: 2000,
            animationType: "slide-in",
          });
          await setTimeout(() => {
            navigation.navigate("Home");
          }, 700);
        }
      } else {
        await setState("Session expired");
        toast.show("Session expired. Please login again", {
          type: "warning",
          placement: "top",
          duration: 2000,
          animationType: "slide-in",
        });
        await setTimeout(() => {
          AsyncStorage.clear();
          navigation.navigate("Login");
        }, 700);
      }
    });
  }, []);

  return (
    <View style={styles.background}>
      <AnimatedContainer>
        <View style={{ paddingVertical: 8 }} />
        <ActivityIndicator size={96} color={colors.secondary_1} />
        <Text style={styles.text_white_medium}>{state}</Text>
      </AnimatedContainer>
    </View>
  );
}

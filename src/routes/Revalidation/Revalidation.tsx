import * as React from "react";
import styles from "../../styles";
import { View, Text, ActivityIndicator } from "react-native";
import Button from "../../components/Button/Button";
import { TokenRefresh, UserInfo, UserLogin } from "../../components/Api/Api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../features/redux/Store/Store";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { MotiView } from "moti";
import { colors } from "../../styles";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootDrawerParamList } from "../../interfaces/Interfaces";
import { setUser } from "../../features/redux/slices/AuthSlice/AuthSlice";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";

export default function Revalidation() {
  const dispatch = useDispatch();
  const navigation = useNavigation<RootDrawerParamList>();
  const creds = useSelector((state: RootState) => state.auth.creds);
  console.log(JSON.stringify(creds));
  const [state, setState] = useState("Checking for existing session");
  useEffect(() => {
    setState("Previous session found");
    TokenRefresh().then(async (response) => {
      if (response[0]) {
        await dispatch(setUser(await UserInfo()));
        setTimeout(() => {
          navigation.navigate("Home");
        }, 700);
      } else {
        setState("Session expired");
        setTimeout(() => {
          navigation.navigate("Login");
        }, 700);
      }
    });
  }, []);

  return (
    <View style={styles.background}>
      <AnimatedContainer>
        <View style={{ paddingVertical: 8 }} />
        <ActivityIndicator size={96} color={colors.blue_1} />
        <Text style={styles.text_white_medium}>{state}</Text>
      </AnimatedContainer>
    </View>
  );
}

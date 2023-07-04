import * as React from "react";
import styles from "../../styles";
import { View, Text, ActivityIndicator } from "react-native";
import { TokenRefresh, UserInfo } from "../../components/Api/Api";
import { useDispatch } from "react-redux";
import { colors } from "../../styles";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootDrawerParamList } from "../../interfaces/Interfaces";
import { setUser } from "../../features/redux/slices/AuthSlice/AuthSlice";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";

export default function Revalidation() {
  const dispatch = useDispatch();
  const navigation = useNavigation<RootDrawerParamList>();
  const [state, setState] = useState("Checking for existing session");
  useEffect(() => {
    setState("Previous session found");
    TokenRefresh().then(async (response) => {
      if (response[0]) {
        let user_info = await UserInfo();
        await dispatch(setUser(user_info));
        if (!(user_info.year_level || user_info.course || user_info.semester)) {
          await setTimeout(() => {
            navigation.navigate("Onboarding");
          }, 700);
        } else {
          await setTimeout(() => {
            navigation.navigate("Home");
          }, 700);
        }
      } else {
        await setState("Session expired");
        await setTimeout(() => {
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

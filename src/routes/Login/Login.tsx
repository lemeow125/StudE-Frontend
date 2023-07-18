import * as React from "react";
import styles from "../../styles";
import {
  View,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useDispatch } from "react-redux";
import { colors } from "../../styles";
import { useState } from "react";
import LoginIcon from "../../icons/LoginIcon/LoginIcon";
import Button from "../../components/Button/Button";
import { useNavigation } from "@react-navigation/native";
import { RootDrawerParamList } from "../../interfaces/Interfaces";
import { UserInfo, UserLogin } from "../../components/Api/Api";
import { ParseLoginError } from "../../components/ParseError/ParseError";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import { setUser } from "../../features/redux/slices/UserSlice/UserSlice";
import {
  login,
  setOnboarding,
  unsetOnboarding,
} from "../../features/redux/slices/StatusSlice/StatusSlice";

export default function Login() {
  const navigation = useNavigation<RootDrawerParamList>();
  const dispatch = useDispatch();
  const [creds, setCreds] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  return (
    <View style={styles.background}>
      <AnimatedContainer>
        <View style={styles.flex_row}>
          <LoginIcon size={32} />
          <Text style={styles.text_white_large}>Student Login</Text>
        </View>
        <View style={{ paddingVertical: 8 }} />
        <View style={styles.padding} />
        <TextInput
          style={styles.text_input}
          placeholder="Username"
          placeholderTextColor="white"
          autoCapitalize="none"
          value={creds.username}
          onChange={(
            e: NativeSyntheticEvent<TextInputChangeEventData>
          ): void => {
            setCreds({ ...creds, username: e.nativeEvent.text });
          }}
        />
        <View style={{ paddingVertical: 4 }} />
        <TextInput
          style={styles.text_input}
          placeholder="Password"
          placeholderTextColor="white"
          secureTextEntry={true}
          value={creds.password}
          onChange={(
            e: NativeSyntheticEvent<TextInputChangeEventData>
          ): void => {
            setCreds({ ...creds, password: e.nativeEvent.text });
          }}
        />
        <View style={{ paddingVertical: 2 }} />
        <Text style={styles.text_white_small}>{error}</Text>
        <View style={{ paddingVertical: 4 }} />
        <Button
          onPress={async () => {
            await UserLogin({
              username: creds.username,
              password: creds.password,
            }).then(async (result) => {
              if (result[0]) {
                setUser({ ...creds, username: "", password: "", error: "" });
                let user_info = await UserInfo();
                dispatch(login());
                dispatch(setUser(user_info[1]));
                // Redirect to onboarding if no year level, course, or semester specified
                if (
                  user_info[1].year_level == null ||
                  user_info[1].course == null ||
                  user_info[1].semester == null
                ) {
                  dispatch(setOnboarding());
                  navigation.navigate("Onboarding");
                } else {
                  dispatch(unsetOnboarding());
                  navigation.navigate("Home");
                }
                console.log(JSON.stringify(user_info));
              } else {
                console.log("heh", ParseLoginError(JSON.stringify(result[1])));
                setError(ParseLoginError(JSON.stringify(result[1])));
              }
            });
          }}
          color={colors.secondary_3}
        >
          <Text style={styles.text_white_small}>Login</Text>
        </Button>
        <Button
          onPress={() => navigation.navigate("Register")}
          color={colors.secondary_3}
        >
          <Text style={styles.text_white_small}>Register</Text>
        </Button>
      </AnimatedContainer>
    </View>
  );
}

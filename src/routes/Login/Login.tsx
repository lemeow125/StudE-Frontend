import * as React from "react";
import styles from "../../styles";
import {
  View,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../features/redux/Store/Store";
import {
  setUser,
  clear,
} from "../../features/redux/slices/AuthSlice/AuthSlice";
import { colors } from "../../styles";
import { useState } from "react";
import LoginIcon from "../../icons/LoginIcon/LoginIcon";
import Button from "../../components/Button/Button";
import { useNavigation } from "@react-navigation/native";
import { RootDrawerParamList } from "../../interfaces/Interfaces";
import { UserLogin } from "../../components/Api/Api";
import { ParseLoginError } from "../../components/ParseError/ParseError";

export default function Login() {
  const navigation = useNavigation<RootDrawerParamList>();
  // const dispatch = useDispatch();
  // const creds = useSelector((state: RootState) => state.auth.creds);
  const [user, setUser] = useState({
    username: "",
    password: "",
    error: "",
  });
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <View
          style={{
            paddingVertical: 4,
            marginBottom: 16,
            borderRadius: 4,
            width: "90%",
            backgroundColor: colors.blue_1,
          }}
        />
        <View style={styles.flex_row}>
          <LoginIcon size={32} />
          <Text style={styles.text_white_large}>Student Login</Text>
        </View>

        <View style={{ paddingVertical: 8 }} />
        <TextInput
          style={styles.text_input}
          placeholder="Username"
          placeholderTextColor="white"
          autoCapitalize="none"
          value={user.username}
          onChange={(
            e: NativeSyntheticEvent<TextInputChangeEventData>
          ): void => {
            setUser({ ...user, username: e.nativeEvent.text });
          }}
        />
        <View style={{ paddingVertical: 4 }} />
        <TextInput
          style={styles.text_input}
          placeholder="Password"
          placeholderTextColor="white"
          secureTextEntry={true}
          value={user.password}
          onChange={(
            e: NativeSyntheticEvent<TextInputChangeEventData>
          ): void => {
            setUser({ ...user, password: e.nativeEvent.text });
          }}
        />
        <View style={{ paddingVertical: 2 }} />
        <Text style={styles.text_white_small}>{user.error}</Text>
        <View style={{ paddingVertical: 4 }} />
        <Button
          onPress={async () => {
            await UserLogin({
              username: user.username,
              password: user.password,
            }).then((result) => {
              if (result[0]) {
                setUser({ ...user, username: "", password: "", error: "" });
                navigation.navigate("Home");
              } else {
                setUser({
                  ...user,
                  error: ParseLoginError(JSON.stringify(result[1])),
                });
              }
            });
          }}
          color={colors.blue_3}
        >
          <Text style={styles.text_white_small}>Login</Text>
        </Button>
        <Button
          onPress={() => navigation.navigate("Register")}
          color={colors.blue_3}
        >
          <Text style={styles.text_white_small}>Register</Text>
        </Button>
      </View>
    </View>
  );
}

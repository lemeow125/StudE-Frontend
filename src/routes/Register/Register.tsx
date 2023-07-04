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
import { colors } from "../../styles";
import { useState } from "react";
import Button from "../../components/Button/Button";
import { useNavigation } from "@react-navigation/native";
import { RootDrawerParamList } from "../../interfaces/Interfaces";
import SignupIcon from "../../icons/SignupIcon/SignupIcon";
import { UserRegister } from "../../components/Api/Api";
import IsNumber from "../../components/IsNumber/IsNumber";
import ParseError from "../../components/ParseError/ParseError";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";

export default function Register() {
  const navigation = useNavigation<RootDrawerParamList>();
  // const dispatch = useDispatch();
  // const creds = useSelector((state: RootState) => state.auth.creds);
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    student_id_number: "",
    username: "",
    email: "",
    password: "",
    feedback: "",
  });
  return (
    <View style={styles.background}>
      <AnimatedContainer>
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
          <SignupIcon size={32} />
          <Text style={styles.text_white_large}>Student Signup</Text>
          <View style={{ paddingVertical: 8 }} />
        </View>
        <TextInput
          style={styles.text_input}
          placeholder="First Name"
          placeholderTextColor="white"
          value={user.first_name}
          onChange={(
            e: NativeSyntheticEvent<TextInputChangeEventData>
          ): void => {
            setUser({ ...user, first_name: e.nativeEvent.text });
          }}
        />
        <View style={{ paddingVertical: 4 }} />
        <TextInput
          style={styles.text_input}
          placeholder="Last Name"
          placeholderTextColor="white"
          value={user.last_name}
          onChange={(
            e: NativeSyntheticEvent<TextInputChangeEventData>
          ): void => {
            setUser({ ...user, last_name: e.nativeEvent.text });
          }}
        />
        <View style={{ paddingVertical: 4 }} />
        <TextInput
          style={styles.text_input}
          placeholder="USTP ID Number"
          placeholderTextColor="white"
          value={user.student_id_number}
          onChange={(
            e: NativeSyntheticEvent<TextInputChangeEventData>
          ): void => {
            if (IsNumber(e.nativeEvent.text)) {
              setUser({ ...user, student_id_number: e.nativeEvent.text });
            } else if (!e.nativeEvent.text) {
              setUser({ ...user, student_id_number: "" });
            }
          }}
        />
        <View style={{ paddingVertical: 4 }} />
        <View style={{ paddingVertical: 4 }} />
        <TextInput
          style={styles.text_input}
          placeholder="Username"
          placeholderTextColor="white"
          autoCapitalize={"none"}
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
          placeholder="Email"
          placeholderTextColor="white"
          autoCapitalize={"none"}
          value={user.email}
          onChange={(
            e: NativeSyntheticEvent<TextInputChangeEventData>
          ): void => {
            setUser({ ...user, email: e.nativeEvent.text });
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
        <View style={{ paddingVertical: 4 }} />
        <Text style={styles.text_white_small}>{user.feedback}</Text>
        <View style={{ paddingVertical: 4 }} />
        <Button
          onPress={async () => {
            await UserRegister({
              username: user.username,
              email: user.email,
              password: user.password,
              student_id_number: user.student_id_number,
              first_name: user.first_name,
              last_name: user.last_name,
            }).then((result) => {
              console.log(result);
              try {
                setUser({
                  ...user,
                  feedback: ParseError(JSON.stringify(result[1])),
                });
              } catch {
                setUser({
                  ...user,
                  first_name: "",
                  last_name: "",
                  student_id_number: "",
                  username: "",
                  email: "",
                  password: "",
                  feedback:
                    "Success! An email has been sent to activate your account",
                });
              }
            });
            {
            }
          }}
          color={colors.blue_3}
        >
          <Text style={styles.text_white_small}>Register</Text>
        </Button>
      </AnimatedContainer>
    </View>
  );
}

import * as React from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { colors } from "../../styles";
import styles from "../../styles";

import { RootDrawerParamList } from "../../interfaces/Interfaces";
import AppIcon from "../../icons/AppIcon/AppIcon";
import HomeIcon from "../../icons/HomeIcon/HomeIcon";
import LoginIcon from "../../icons/LoginIcon/LoginIcon";
import SignupIcon from "../../icons/SignupIcon/SignupIcon";
import DrawerButton from "../Button/DrawerButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../features/redux/Store/Store";
import LogoutIcon from "../../icons/LogoutIcon/LogoutIcon";
import { logout } from "../../features/redux/slices/StatusSlice/StatusSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CustomDrawerContent(props: {}) {
  const navigation = useNavigation<RootDrawerParamList>();
  const status = useSelector((state: RootState) => state.status);
  const dispatch = useDispatch();
  if (status.logged_in && status.onboarding) {
    return (
      <DrawerContentScrollView {...props}>
        <View
          style={{
            ...styles.flex_row,
            ...{ justifyContent: "center" },
          }}
        >
          <AppIcon size={32} />
          <Text style={styles.text_white_medium}>Stud-E</Text>
        </View>

        <DrawerButton
          color={colors.blue_2}
          onPress={async () => {
            dispatch(logout());
            await AsyncStorage.clear();
            navigation.navigate("Login");
          }}
        >
          <LogoutIcon size={32} />
          <Text style={styles.text_white_medium}>Logout</Text>
        </DrawerButton>
      </DrawerContentScrollView>
    );
  } else if (status.logged_in) {
    return (
      <DrawerContentScrollView {...props}>
        <View
          style={{
            ...styles.flex_row,
            ...{ justifyContent: "center" },
          }}
        >
          <AppIcon size={32} />
          <Text style={styles.text_white_medium}>Stud-E</Text>
        </View>
        <DrawerButton
          color={colors.blue_2}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <HomeIcon size={32} />
          <Text style={styles.text_white_medium}>Home</Text>
        </DrawerButton>
        <DrawerButton
          color={colors.blue_2}
          onPress={async () => {
            dispatch(logout());
            await AsyncStorage.clear();
            navigation.navigate("Login");
          }}
        >
          <LogoutIcon size={32} />
          <Text style={styles.text_white_medium}>Logout</Text>
        </DrawerButton>
      </DrawerContentScrollView>
    );
  } else {
    return (
      <DrawerContentScrollView {...props}>
        <View
          style={{
            ...styles.flex_row,
            ...{ justifyContent: "center" },
          }}
        >
          <AppIcon size={32} />
          <Text style={styles.text_white_medium}>Stud-E</Text>
        </View>
        <DrawerButton
          color={colors.blue_2}
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <LoginIcon size={32} />
          <Text style={styles.text_white_medium}>Login</Text>
        </DrawerButton>
        <DrawerButton
          color={colors.blue_2}
          onPress={() => {
            navigation.navigate("Register");
          }}
        >
          <SignupIcon size={32} />
          <Text style={styles.text_white_medium}>Register</Text>
        </DrawerButton>
        {/*
        Debug buttons for accessing revalidation and activation page
        <DrawerButton
          color={colors.blue_2}
          onPress={() => {
            navigation.navigate("Revalidation");
          }}
        >
          <Text style={styles.text_white_medium}>Revalidation</Text>
        </DrawerButton>
        <DrawerButton
          color={colors.blue_2}
          onPress={() => {
            navigation.navigate("Activation");
          }}
        >
          <Text style={styles.text_white_medium}>Activation</Text>
        </DrawerButton>
        */}
      </DrawerContentScrollView>
    );
  }
}

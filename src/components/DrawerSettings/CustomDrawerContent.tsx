import * as React from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { colors } from "../../styles";
import styles from "../../styles";

import {
  RootDrawerParamList,
  StudentStatusPatchType,
} from "../../interfaces/Interfaces";
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
import UserIcon from "../../icons/UserIcon/UserIcon";
import SubjectIcon from "../../icons/SubjectIcon/SubjectIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-native-toast-notifications/lib/typescript/toast";
import { PatchStudentStatus } from "../Api/Api";
import { useToast } from "react-native-toast-notifications";

export default function CustomDrawerContent(props: {}) {
  const debug = true;
  const navigation = useNavigation<RootDrawerParamList>();
  const status = useSelector((state: RootState) => state.status);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const toast = useToast();
  const stop_studying_logout = useMutation({
    mutationFn: async (info: StudentStatusPatchType) => {
      const data = await PatchStudentStatus(info);
      if (data[0] != true) {
        return Promise.reject(new Error());
      }
      console.log("DEBUG", data);
      return data;
    },
    onSuccess: async () => {
      toast.show("Logged out. Stopped studying", {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
      queryClient.clear();
      dispatch(logout());
      await AsyncStorage.clear();
      navigation.navigate("Login");
    },
    onError: (error: Error) => {
      toast.show(String(error), {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
    },
  });
  if (status.logged_in && status.onboarding) {
    return (
      <DrawerContentScrollView {...props}>
        <View
          style={{
            ...styles.flex_row,
            ...{ justifyContent: "center" },
          }}
        >
          <AppIcon size={96} />
          <Text style={styles.text_white_medium}>Stud-E</Text>
        </View>

        <DrawerButton
          onPress={async () => {
            // We don't clear student statuses when logging out on debug
            if (!debug) {
              queryClient.clear();
              dispatch(logout());
              await AsyncStorage.clear();
              navigation.navigate("Login");
            } else {
              stop_studying_logout.mutate({
                active: false,
              });
            }
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
          <AppIcon size={96} />
          <Text style={styles.text_white_medium}>Stud-E</Text>
        </View>
        <DrawerButton
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <HomeIcon size={32} />
          <Text style={styles.text_white_medium}>Home</Text>
        </DrawerButton>
        <DrawerButton
          onPress={() => {
            navigation.navigate("User Info");
          }}
        >
          <UserIcon size={32} />
          <Text style={styles.text_white_medium}>User Info</Text>
        </DrawerButton>
        <DrawerButton
          onPress={() => {
            navigation.navigate("Subjects");
          }}
        >
          <SubjectIcon size={32} />
          <Text style={styles.text_white_medium}>Subjects</Text>
        </DrawerButton>
        <DrawerButton
          onPress={() => {
            navigation.navigate("Conversation");
          }}
        >
          <SubjectIcon size={32} />
          <Text style={styles.text_white_medium}>Conversation</Text>
        </DrawerButton>
        <DrawerButton
          onPress={async () => {
            // We don't clear student statuses when logging out on debug
            if (!debug) {
              queryClient.clear();
              dispatch(logout());
              await AsyncStorage.clear();
              navigation.navigate("Login");
            } else {
              stop_studying_logout.mutate({
                active: false,
              });
            }
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
          <AppIcon size={96} />
          <Text style={styles.text_white_medium}>Stud-E</Text>
        </View>
        <DrawerButton
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <LoginIcon size={32} />
          <Text style={styles.text_white_medium}>Login</Text>
        </DrawerButton>
        <DrawerButton
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
          color={colors.secondary_2}
          onPress={() => {
            navigation.navigate("Revalidation");
          }}
        >
          <Text style={styles.text_white_medium}>Revalidation</Text>
        </DrawerButton>
        <DrawerButton
          color={colors.secondary_2}
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

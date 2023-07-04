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
import AddIcon from "../../icons/AddIcon/AddIcon";

export default function CustomDrawerContent(props: {}) {
  const navigation = useNavigation<RootDrawerParamList>();
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
      <DrawerButton
        color={colors.blue_2}
        onPress={() => {
          navigation.navigate("Revalidation");
        }}
      >
        <AddIcon size={32} />
        <Text style={styles.text_white_medium}>Revalidation</Text>
      </DrawerButton>
      <DrawerButton
        color={colors.blue_2}
        onPress={() => {
          navigation.navigate("Activation");
        }}
      >
        <AddIcon size={32} />
        <Text style={styles.text_white_medium}>Activation</Text>
      </DrawerButton>
    </DrawerContentScrollView>
  );
}

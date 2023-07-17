import * as React from "react";
import styles from "../../styles";
import {
  View,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { colors } from "../../styles";
import { useState, useEffect } from "react";
import Button from "../../components/Button/Button";
import { useNavigation } from "@react-navigation/native";
import {
  RootDrawerParamList,
  UserInfoParams,
} from "../../interfaces/Interfaces";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import { TouchableOpacity, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SelectDropdown from "react-native-select-dropdown";
import DropdownIcon from "../../icons/DropdownIcon/DropdownIcon";
import { useQuery } from "react-query";
import { UserInfo as GetUserInfo } from "../../components/Api/Api";

export default function UserInfo() {
  const UserInfo = useQuery("user", GetUserInfo, {
    onSuccess: (data: UserInfoParams) => {
      setUser({
        ...user,
        first_name: data[1].first_name,
        last_name: data[1].last_name,
        year_level: data[1].year_level,
        semester: data[1].semester,
        course: data[1].course,
        avatar: data[1].avatar,
      });
    },
  });
  const navigation = useNavigation<RootDrawerParamList>();
  const [isEditable, setIsEditable] = useState(false);
  const subjectOptions = ["", "", "", ""];
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    year_level: "",
    semester: "",
    course: "",
    avatar: "",
  });
  function Avatar() {
    if (user.avatar) {
      return <Image source={{ uri: user.avatar }} style={styles.profile} />;
    } else {
      return (
        <Image
          source={require("../../img/user_profile_placeholder.png")}
          style={styles.profile}
        />
      );
    }
  }
  return (
    <ScrollView style={styles.background}>
      <AnimatedContainer>
        <Text style={styles.text_white_large}>
          {user.first_name + " " + user.last_name}
        </Text>
        <View>
          <Avatar />
        </View>
        <View style={styles.padding} />
        <View style={styles.flex_row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text}>First Name</Text>
          </View>
          <View style={{ flex: 3 }}>
            <TextInput
              style={styles.input}
              editable={isEditable}
              onChange={(
                e: NativeSyntheticEvent<TextInputChangeEventData>
              ): void => {
                setUser({ ...user, first_name: e.nativeEvent.text });
              }}
              value={user.first_name}
            />
          </View>
        </View>
        <View style={styles.flex_row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text}>Last Name</Text>
          </View>
          <View style={{ flex: 3 }}>
            <TextInput
              style={[styles.input, !isEditable && styles.input]}
              editable={isEditable}
              onChange={(
                e: NativeSyntheticEvent<TextInputChangeEventData>
              ): void => {
                setUser({ ...user, last_name: e.nativeEvent.text });
              }}
              value={user.last_name}
            />
          </View>
        </View>
        <View style={styles.padding} />
        <View style={styles.flex_row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text}>Year Level</Text>
          </View>
          <View style={{ flex: 3 }}>
            <TextInput
              style={[styles.input, !isEditable && styles.input]}
              editable={isEditable}
              onChange={(
                e: NativeSyntheticEvent<TextInputChangeEventData>
              ): void => {
                setUser({ ...user, year_level: e.nativeEvent.text });
              }}
              value={user.year_level}
            />
          </View>
        </View>
        <View style={styles.flex_row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text}>Semester</Text>
          </View>
          <View style={{ flex: 3 }}>
            <TextInput
              style={[styles.input, !isEditable && styles.input]}
              editable={isEditable}
              onChange={(
                e: NativeSyntheticEvent<TextInputChangeEventData>
              ): void => {
                setUser({ ...user, semester: e.nativeEvent.text });
              }}
              value={user.semester}
            />
          </View>
        </View>
        <View style={styles.flex_row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text}>Course</Text>
          </View>
          <View style={{ flex: 3 }}>
            <TextInput
              style={[styles.input, !isEditable && styles.input]}
              editable={isEditable}
              onChange={(
                e: NativeSyntheticEvent<TextInputChangeEventData>
              ): void => {
                setUser({ ...user, course: e.nativeEvent.text });
              }}
              value={user.course}
            />
          </View>
        </View>
        <View style={styles.padding} />
        <View style={styles.flex_row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text}>Subject</Text>
          </View>
          <View style={{ flex: 3 }}>
            <SelectDropdown
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
              }}
              renderDropdownIcon={() => <DropdownIcon size={32} />}
              buttonTextStyle={{
                color: "white",
              }}
              dropdownStyle={{
                backgroundColor: "#E3963E",
              }}
              data={subjectOptions}
              buttonStyle={{
                width: "90%",
                marginLeft: 10,
                backgroundColor: "#E3963E",
                borderRadius: 8,
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.button_template}
          onPress={() => setIsEditable(!isEditable)}
        >
          <Text style={styles.text_white_small}>
            {isEditable && UserInfo.isSuccess ? "Save" : "Edit Profile"}
          </Text>
        </TouchableOpacity>
      </AnimatedContainer>
    </ScrollView>
  );
}

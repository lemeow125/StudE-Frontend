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
import { RootDrawerParamList } from "../../interfaces/Interfaces";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import { TouchableOpacity, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SelectDropdown from "react-native-select-dropdown";
import DropdownIcon from "../../icons/DropdownIcon/DropdownIcon";

export default function UserInfo() {
  const navigation = useNavigation<RootDrawerParamList>();
  const [isEditable, setIsEditable] = useState(false);
  const options = ["", "", "", ""];
  const [isActive, setIsActive] = useState(false);
  const toggleUserActive = () => {
    setIsActive(!isActive);
  };
  //const dispatch = useDispatch();
  // const creds = useSelector((state: RootState) => state.auth.creds);
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    year_level: "",
    semester: "",
    course: "",
  });
  return (
    <ScrollView style={styles.background}>
      <AnimatedContainer>
        <Text style={{ ...styles.text_white_medium, ...{ fontSize: 32 } }}>
          Kurt Toledo
        </Text>
        <View>
          <Image
            source={require("./image/3135715.png")}
            style={styles.profile}
          />
          <TouchableOpacity onPress={toggleUserActive} style={styles.button}>
            <Text
              style={[
                styles.text,
                isActive ? styles.activeText : styles.inactiveText,
              ]}
            >
              Student {isActive ? "Active" : "Inactive"}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: 4,
            marginBottom: 16,
            marginTop: 8,
            borderRadius: 4,
            width: "90%",
            backgroundColor: colors.head,
          }}
        />
        <View style={styles.formGroup}>
          <View style={{ width: 70 }}>
            <Text style={styles.text}>First Name</Text>
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[styles.input, !isEditable && styles.input]}
              editable={isEditable}
              onChange={(
                e: NativeSyntheticEvent<TextInputChangeEventData>
              ): void => {
                setUser({ ...user, first_name: e.nativeEvent.text });
              }}
            />
          </View>
        </View>
        <View style={styles.formGroup}>
          <View style={{ width: 70 }}>
            <Text style={styles.text}>Last Name</Text>
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[styles.input, !isEditable && styles.input]}
              editable={isEditable}
              onChange={(
                e: NativeSyntheticEvent<TextInputChangeEventData>
              ): void => {
                setUser({ ...user, first_name: e.nativeEvent.text });
              }}
            />
          </View>
        </View>
        <View
          style={{
            paddingVertical: 4,
            marginBottom: 16,
            marginTop: 8,
            borderRadius: 4,
            width: "90%",
            backgroundColor: colors.head,
          }}
        />
        <View style={styles.formGroup}>
          <View style={{ width: 70 }}>
            <Text style={styles.text}>Year Level</Text>
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[styles.input, !isEditable && styles.input]}
              editable={isEditable}
              onChange={(
                e: NativeSyntheticEvent<TextInputChangeEventData>
              ): void => {
                setUser({ ...user, first_name: e.nativeEvent.text });
              }}
            />
          </View>
        </View>
        <View style={styles.formGroup}>
          <View style={{ width: 70 }}>
            <Text style={styles.text}>Semester</Text>
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[styles.input, !isEditable && styles.input]}
              editable={isEditable}
              onChange={(
                e: NativeSyntheticEvent<TextInputChangeEventData>
              ): void => {
                setUser({ ...user, first_name: e.nativeEvent.text });
              }}
            />
          </View>
        </View>
        <View style={styles.formGroup}>
          <View style={{ width: 70 }}>
            <Text style={styles.text}>Course</Text>
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[styles.input, !isEditable && styles.input]}
              editable={isEditable}
              onChange={(
                e: NativeSyntheticEvent<TextInputChangeEventData>
              ): void => {
                setUser({ ...user, first_name: e.nativeEvent.text });
              }}
            />
          </View>
        </View>
        <View
          style={{
            paddingVertical: 4,
            marginBottom: 16,
            marginTop: 8,
            borderRadius: 4,
            width: "90%",
            backgroundColor: colors.head,
          }}
        />
        <View style={styles.formGroup}>
          <View style={{ width: 80 }}>
            <Text style={styles.text}>Subject</Text>
          </View>
          <View style={{ flex: 1 }}>
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
              data={options}
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
            {isEditable ? "Save" : "Edit Profile"}
          </Text>
        </TouchableOpacity>
      </AnimatedContainer>
    </ScrollView>
  );
}

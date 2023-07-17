import * as React from "react";
import styles from "../../styles";
import {
  View,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  RootDrawerParamList,
  SemesterParams,
  UserInfoParams,
  Semester,
} from "../../interfaces/Interfaces";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import { TouchableOpacity, Image } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetSemesters,
  GetSubjects,
  PatchUserInfo,
  UserInfo,
} from "../../components/Api/Api";
import { colors } from "../../styles";
import DropDownPicker from "react-native-dropdown-picker";
import AnimatedContainerNoScroll from "../../components/AnimatedContainer/AnimatedContainerNoScroll";

export default function UserInfoPage() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    year_level: "",
    semester: "",
    course: "",
    avatar: "",
  });
  const [displayName, setDisplayName] = useState({
    first_name: "",
    last_name: "",
  });
  const StudentInfo = useQuery({
    queryKey: ["user"],
    queryFn: UserInfo,
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
      setDisplayName({
        first_name: data[1].first_name,
        last_name: data[1].last_name,
      });
    },
  });
  const mutation = useMutation({
    mutationFn: PatchUserInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
  const [semesters, setSemesters] = useState([
    { label: "", value: "", shortname: "" },
  ]);
  const Semesters = useQuery({
    queryKey: ["semesters"],
    queryFn: GetSemesters,
    onSuccess: (data: SemesterParams) => {
      let semestersData = data[1].map((semester: Semester) => ({
        label: semester.name,
        value: semester.id,
        shortname: semester.shortname,
      }));

      // Update the 'semesters' state
      setSemesters(semestersData);
    },
  });
  const [isEditable, setIsEditable] = useState(false);
  const subjectOptions = ["", "", "", ""];

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
  const [selected_subjects, setSelectedSubjects] = useState([]);
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [subjects, setSubjects] = useState([{ label: "", value: "" }]);
  return (
    <View style={styles.background}>
      <AnimatedContainerNoScroll>
        <Text style={styles.text_white_medium_large}>
          {(displayName.first_name || "Undefined") +
            " " +
            (displayName.last_name || "User")}
        </Text>
        <View>
          <Avatar />
        </View>
        <View style={styles.padding} />
        <View style={styles.flex_row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text_white_small_bold}>First Name</Text>
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
            <Text style={styles.text_white_small_bold}>Last Name</Text>
          </View>
          <View style={{ flex: 3 }}>
            <TextInput
              style={styles.input}
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
            <Text style={styles.text_white_small_bold}>Year Level</Text>
          </View>
          <View style={{ flex: 3 }}>
            <TextInput
              style={styles.input}
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
            <Text style={styles.text_white_small_bold}>Semester</Text>
          </View>
          <View style={{ flex: 3 }}>
            <TextInput
              style={styles.input}
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
            <Text style={styles.text_white_small_bold}>Course</Text>
          </View>
          <View style={{ flex: 3 }}>
            <TextInput
              style={styles.input}
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
            <Text style={styles.text_white_small_bold}>Subjects</Text>
          </View>
          <View style={{ flex: 3 }}>
            <DropDownPicker
              multiple={true}
              max={16}
              open={subjectsOpen}
              value={selected_subjects}
              items={subjects}
              setOpen={(open) => setSubjectsOpen(open)}
              setValue={setSelectedSubjects}
              placeholder="Subjects"
              style={styles.input}
              textStyle={styles.text_white_small_bold}
              dropDownContainerStyle={{ backgroundColor: "white" }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.button_template}
          onPress={() => {
            if (isEditable) {
              mutation.mutate({
                first_name: user.first_name,
                last_name: user.last_name,
                course: user.course,
                semester: user.semester,
                subjects: [],
                year_level: user.year_level,
              });
            }
            setIsEditable(!isEditable);
          }}
        >
          <Text style={styles.text_white_small}>
            {isEditable && StudentInfo.isSuccess ? "Save" : "Edit Profile"}
          </Text>
        </TouchableOpacity>
      </AnimatedContainerNoScroll>
    </View>
  );
}

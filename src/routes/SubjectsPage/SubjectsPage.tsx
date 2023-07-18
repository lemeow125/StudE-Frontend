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
import {
  SemesterParams,
  UserInfoParams,
  Semester,
  SubjectParams,
  Subject,
  YearLevel,
  Course,
  OptionType,
  Subjects,
} from "../../interfaces/Interfaces";
import Button from "../../components/Button/Button";
import { Image } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetCourses,
  GetSemesters,
  GetSubjects,
  GetYearLevels,
  PatchUserInfo,
  UserInfo,
} from "../../components/Api/Api";
import { colors } from "../../styles";
import DropDownPicker from "react-native-dropdown-picker";
import { ValueType } from "react-native-dropdown-picker";
import AnimatedContainerNoScroll from "../../components/AnimatedContainer/AnimatedContainerNoScroll";

export default function SubjectsPage() {
  const queryClient = useQueryClient();
  // User Info
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    year_level: "",
    yearlevel_shortname: "",
    semester: "",
    semester_shortname: "",
    course: "",
    course_shortname: "",
    avatar: "",
    student_id_number: "",
    subjects: [] as Subjects,
  });
  const [displayName, setDisplayName] = useState({
    first_name: "",
    last_name: "",
  });
  const StudentInfo = useQuery({
    queryKey: ["user"],
    queryFn: UserInfo,
    onSuccess: (data: UserInfoParams) => {
      //  console.log(data[1]);
      setUser({
        ...user,
        first_name: data[1].first_name,
        last_name: data[1].last_name,
        year_level: data[1].year_level,
        semester: data[1].semester,
        course: data[1].course,
        avatar: data[1].avatar,
        student_id_number: data[1].student_id_number,
        subjects: data[1].subjects,
      });
      setDisplayName({
        first_name: data[1].first_name,
        last_name: data[1].last_name,
      });
      setSelectedSubjects(user.subjects);
    },
  });
  const mutation = useMutation({
    mutationFn: PatchUserInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setSelectedSubjects([]);
    },
  });

  // Subjects

  const [selected_subjects, setSelectedSubjects] = useState<any>([]);
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [subjects, setSubjects] = useState<OptionType[]>([]);

  const Subjects = useQuery({
    enabled: StudentInfo.isFetched,
    queryKey: ["subjects"],
    queryFn: async () => {
      let data;
      if (StudentInfo.data) {
        if (
          StudentInfo.data[1].course_shortname &&
          StudentInfo.data[1].yearlevel_shortname &&
          StudentInfo.data[1].semester_shortname
        ) {
          data = await GetSubjects(
            StudentInfo.data[1].course_shortname,
            StudentInfo.data[1].yearlevel_shortname,
            StudentInfo.data[1].semester_shortname
          );
        }
      }
      if (data) {
        if (!data[0]) {
          throw new Error("Error with query" + data[1]);
        }
        if (!data[1]) {
          throw new Error("User has no course, year level, or semester!");
        }
        // console.log("Subjects available:", data[1]);
      }
      return data;
    },
    onSuccess: (data: SubjectParams) => {
      let subjectsData = data[1].map((subject: Subject) => ({
        label: subject.name,
        value: subject.name,
      }));
      // Update the 'subjects' state
      setSelectedSubjects(user.subjects);
      setSubjects(subjectsData);
    },
  });

  // Profile photo
  function Avatar() {
    if (user.avatar) {
      return <Image source={{ uri: user.avatar }} style={styles.profile} />;
    } else {
      return (
        <Image
          source={require("../../img/user_profile_placeholder.png")}
          style={{ ...styles.profile, ...{ marginRight: 48 } }}
        />
      );
    }
  }

  return (
    <View style={styles.background}>
      <AnimatedContainerNoScroll>
        <View style={styles.flex_row}>
          <Avatar />
          <Text style={{ ...styles.text_white_small, ...{ marginLeft: 16 } }}>
            {(displayName.first_name || "Undefined") +
              " " +
              (displayName.last_name || "User") +
              "\n" +
              user.student_id_number}
          </Text>
        </View>

        <View style={styles.padding} />
        <View style={styles.flex_row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text_white_small_bold}>Subjects</Text>
          </View>
          <View style={{ flex: 3 }}>
            <DropDownPicker
              zIndex={1000}
              multiple={true}
              max={16}
              open={subjectsOpen}
              value={selected_subjects}
              items={subjects}
              setOpen={(open) => {
                setSubjectsOpen(open);
              }}
              setValue={setSelectedSubjects}
              placeholderStyle={{
                ...styles.text_white_tiny_bold,
                ...{ textAlign: "left" },
              }}
              placeholder="Select subjects"
              multipleText="Select subjects"
              style={styles.input}
              textStyle={{
                ...styles.text_white_tiny_bold,
                ...{ textAlign: "left" },
              }}
              dropDownContainerStyle={{
                backgroundColor: colors.primary_2,
                borderWidth: 0,
                zIndex: 1000,
                maxHeight: 512,
              }}
              dropDownDirection="TOP"
            />
          </View>
        </View>
        <View style={{ zIndex: -1 }}>
          <Button
            color={colors.secondary_3}
            onPress={() => {
              if (subjectsOpen) {
                setSelectedSubjects([]);
                setSubjectsOpen(false);
                mutation.mutate({
                  subjects: selected_subjects,
                });
              }
            }}
          >
            <Text style={styles.text_white_small}>
              {subjectsOpen && StudentInfo.isSuccess ? "Save" : "Edit Subjects"}
            </Text>
          </Button>
        </View>
      </AnimatedContainerNoScroll>
    </View>
  );
}

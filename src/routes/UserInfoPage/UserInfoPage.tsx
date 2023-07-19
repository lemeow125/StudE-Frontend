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

export default function UserInfoPage() {
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
      });
      setDisplayName({
        first_name: data[1].first_name,
        last_name: data[1].last_name,
      });
      setSelectedCourse(data[1].course);
      setSelectedSemester(data[1].semester);
      setSelectedYearLevel(data[1].year_level);
    },
  });
  const mutation = useMutation({
    mutationFn: PatchUserInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });

  // Semester
  const [selected_semester, setSelectedSemester] = useState("");
  const [semesterOpen, setSemesterOpen] = useState(false);
  const [semesters, setSemesters] = useState<OptionType[]>([]);
  const Semesters = useQuery({
    queryKey: ["semesters"],
    queryFn: GetSemesters,
    onSuccess: (data: SemesterParams) => {
      let semestersData = data[1].map((semester: Semester) => ({
        label: semester.name,
        value: semester.name,
        shortname: semester.shortname,
      }));
      // Update the 'semesters' state
      setSemesters(semestersData);
    },
  });

  // Year Level
  const [selected_yearlevel, setSelectedYearLevel] = useState("");
  const [yearLevelOpen, setYearLevelOpen] = useState(false);
  const [year_levels, setYearLevels] = useState<OptionType[]>([]);
  const yearlevel_query = useQuery({
    queryKey: ["year_levels"],
    queryFn: GetYearLevels,
    onSuccess: (data) => {
      let year_levels = data[1].map((yearlevel: YearLevel) => ({
        label: yearlevel.name,
        value: yearlevel.name,
      }));
      setYearLevels(year_levels);
    },
  });

  // Course
  const [selected_course, setSelectedCourse] = useState("");
  const [courseOpen, setCourseOpen] = useState(false);
  const [courses, setCourses] = useState<OptionType[]>([]);
  const course_query = useQuery({
    queryKey: ["courses"],
    queryFn: GetCourses,
    onSuccess: (data) => {
      let courses = data[1].map((course: Course) => ({
        label: course.name,
        value: course.name,
      }));
      setCourses(courses);
    },
  });
  // Toggle editing of profile
  const [isEditable, setIsEditable] = useState(false);
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
        <View style={styles.flex_row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text_white_small_bold}>Year Level</Text>
          </View>
          <View style={{ flex: 3 }}>
            <DropDownPicker
              disabled={!isEditable}
              zIndex={4000}
              open={yearLevelOpen}
              value={selected_yearlevel}
              items={year_levels}
              setOpen={(open) => {
                setYearLevelOpen(open);
                setSemesterOpen(false);
                setCourseOpen(false);
              }}
              setValue={setSelectedYearLevel}
              placeholder={user.year_level}
              placeholderStyle={{
                ...styles.text_white_tiny_bold,
                ...{ textAlign: "left" },
              }}
              style={styles.input}
              textStyle={{
                ...styles.text_white_tiny_bold,
                ...{ textAlign: "left" },
              }}
              dropDownContainerStyle={{
                backgroundColor: colors.primary_2,
                zIndex: 4000,
                borderWidth: 0,
              }}
              dropDownDirection="TOP"
            />
          </View>
        </View>
        <View style={styles.flex_row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text_white_small_bold}>Semester</Text>
          </View>
          <View style={{ flex: 3 }}>
            <DropDownPicker
              disabled={!isEditable}
              zIndex={3000}
              open={semesterOpen}
              value={selected_semester}
              items={semesters}
              setOpen={(open) => {
                setYearLevelOpen(false);
                setSemesterOpen(open);
                setCourseOpen(false);
              }}
              setValue={setSelectedSemester}
              placeholder={user.semester}
              placeholderStyle={{
                ...styles.text_white_tiny_bold,
                ...{ textAlign: "left" },
              }}
              style={styles.input}
              textStyle={{
                ...styles.text_white_tiny_bold,
                ...{ textAlign: "left" },
              }}
              dropDownContainerStyle={{
                backgroundColor: colors.primary_2,
                zIndex: 3000,
                borderWidth: 0,
              }}
              dropDownDirection="TOP"
            />
          </View>
        </View>
        <View style={styles.flex_row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text_white_small_bold}>Course</Text>
          </View>
          <View style={{ flex: 3 }}>
            <DropDownPicker
              disabled={!isEditable}
              zIndex={2000}
              open={courseOpen}
              value={selected_course}
              items={courses}
              setOpen={(open) => {
                setYearLevelOpen(false);
                setSemesterOpen(false);
                setCourseOpen(open);
              }}
              setValue={setSelectedCourse}
              placeholder={user.course}
              placeholderStyle={{
                ...styles.text_white_tiny_bold,
                ...{ textAlign: "left" },
              }}
              style={styles.input}
              textStyle={{
                ...styles.text_white_tiny_bold,
                ...{ textAlign: "left" },
              }}
              dropDownContainerStyle={{
                backgroundColor: colors.primary_2,
                zIndex: 2000,
                borderWidth: 0,
              }}
              dropDownDirection="TOP"
            />
          </View>
        </View>
        <View style={styles.padding} />
        <View style={{ zIndex: -1 }}>
          <Button
            onPress={() => {
              if (isEditable) {
                setYearLevelOpen(false);
                setSemesterOpen(false);
                setCourseOpen(false);
                mutation.mutate({
                  first_name: user.first_name,
                  last_name: user.last_name,
                  course: selected_course,
                  semester: selected_semester,
                  year_level: selected_yearlevel,
                });
              }
              setIsEditable(!isEditable);
            }}
          >
            <Text style={styles.text_white_small}>
              {isEditable && StudentInfo.isSuccess ? "Save" : "Edit Profile"}
            </Text>
          </Button>
        </View>
      </AnimatedContainerNoScroll>
    </View>
  );
}

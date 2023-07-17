import * as React from "react";
import styles from "../../styles";
import {
  View,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  RootDrawerParamList,
  SemesterParams,
  UserInfoParams,
  Semester,
  SubjectParams,
  Subject,
  YearLevel,
  Course,
} from "../../interfaces/Interfaces";
import Button from "../../components/Button/Button";
import { TouchableOpacity, Image } from "react-native";
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
import AnimatedContainerNoScroll from "../../components/AnimatedContainer/AnimatedContainerNoScroll";

export default function UserInfoPage() {
  const queryClient = useQueryClient();
  // User Info
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

  // Semester
  const [selected_semester, setSelectedSemester] = useState("");
  const [semesterOpen, setSemesterOpen] = useState(false);
  const [semesters, setSemesters] = useState([
    { label: "", value: "", shortname: "" },
  ]);
  const Semesters = useQuery({
    queryKey: ["semesters"],
    queryFn: GetSemesters,
    onSuccess: (data: SemesterParams) => {
      console.log("Semesters", data[1]);
      let semestersData = data[1].map((semester: Semester) => ({
        label: semester.name,
        value: semester.id,
        shortname: semester.shortname,
      }));
      // Update the 'semesters' state
      setSemesters(semestersData);
      console.log(semesters);
    },
  });

  // Subjects
  const [selected_subjects, setSelectedSubjects] = useState([]);
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [subjects, setSubjects] = useState([
    { id: 0, label: "", value: "", shortname: "" },
  ]);

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
      }

      return data;
    },
    onSuccess: (data: SubjectParams) => {
      let subjectsData = data[1].map((subject: Subject) => ({
        id: Number(subject.id),
        label: subject.name,
        value: subject.id,
        shortname: subject.code,
      }));

      // Update the 'subjects' state
      setSubjects(subjectsData);
    },
  });

  // Year Level
  const [selected_yearlevel, setSelectedYearLevel] = useState("");
  const [yearLevelOpen, setYearLevelOpen] = useState(false);
  const [year_levels, setYearLevels] = useState([{ label: "", value: "" }]);
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
  const [courses, setCourses] = useState([
    {
      label: "",
      value: "",
    },
  ]);
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
          style={styles.profile}
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
              (displayName.last_name || "User")}
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
        <View style={styles.padding} />
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
                setSubjectsOpen(false);
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
              containerStyle={{ zIndex: 4000 }}
              dropDownContainerStyle={{ backgroundColor: colors.primary_2 }}
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
                setSubjectsOpen(false);
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
              containerStyle={{ zIndex: 3000 }}
              dropDownContainerStyle={{ backgroundColor: colors.primary_2 }}
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
                setSubjectsOpen(false);
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
              containerStyle={{ zIndex: 2000 }}
              dropDownContainerStyle={{ backgroundColor: colors.primary_2 }}
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
              zIndex={1000}
              disabled={!isEditable}
              multiple={true}
              max={16}
              open={subjectsOpen}
              value={selected_subjects}
              items={subjects}
              setOpen={(open) => {
                setYearLevelOpen(false);
                setSemesterOpen(false);
                setCourseOpen(false);
                setSubjectsOpen(open);
              }}
              setValue={setSelectedSubjects}
              placeholder="Subjects"
              placeholderStyle={{
                ...styles.text_white_tiny_bold,
                ...{ textAlign: "left" },
              }}
              style={styles.input}
              textStyle={{
                ...styles.text_white_tiny_bold,
                ...{ textAlign: "left" },
              }}
              containerStyle={{ zIndex: 12000 }}
              dropDownContainerStyle={{ backgroundColor: colors.primary_2 }}
            />
          </View>
        </View>
        <View style={{ zIndex: -1 }}>
          <Button
            color={colors.secondary_3}
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
          </Button>
        </View>
      </AnimatedContainerNoScroll>
    </View>
  );
}

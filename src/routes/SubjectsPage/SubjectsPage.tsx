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
      setSelectedCourse(data[1].course);
      setSelectedSemester(data[1].semester);
      setSelectedYearLevel(data[1].year_level);
      console.log(user.subjects);
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

  // Subjects

  const [selected_subjects, setSelectedSubjects] = useState<any>([]);
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [subjects, setSubjects] = useState<OptionType[]>([]);

  const Subjects = useQuery({
    enabled: StudentInfo.isFetched && !StudentInfo.isStale,
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
      setSubjects(subjectsData);
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
                setSubjectsOpen(false);
              }}
              onChangeValue={() => {
                setSelectedSubjects([]);
                queryClient.invalidateQueries({ queryKey: ["subjects"] });
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
                setSubjectsOpen(false);
              }}
              onChangeValue={() => {
                setSelectedSubjects([]);
                queryClient.invalidateQueries({ queryKey: ["subjects"] });
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
                setSubjectsOpen(false);
              }}
              onChangeValue={() => {
                setSelectedSubjects([]);
                queryClient.invalidateQueries({ queryKey: ["subjects"] });
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
              }}
              dropDownDirection="TOP"
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
                zIndex: 1000,
              }}
              dropDownDirection="TOP"
            />
          </View>
        </View>
        <View style={{ zIndex: -1 }}>
          <Button
            color={colors.secondary_3}
            onPress={() => {
              if (isEditable) {
                setSelectedSubjects([]);
                setYearLevelOpen(false);
                setSemesterOpen(false);
                setCourseOpen(false);
                setSubjectsOpen(false);
                mutation.mutate({
                  first_name: user.first_name,
                  last_name: user.last_name,
                  course: selected_course,
                  semester: selected_semester,
                  subjects: selected_subjects,
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

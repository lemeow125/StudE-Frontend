import * as React from "react";
import styles from "../../styles";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  CourseParams,
  RootDrawerParamList,
  SemesterParams,
  YearLevelParams,
} from "../../interfaces/Interfaces";
import { colors } from "../../styles";
import { AnimatePresence, MotiView } from "moti";
import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import DropDownPicker from "react-native-dropdown-picker";
import isStringEmpty from "../../components/IsStringEmpty/IsStringEmpty";
import { useQuery } from "@tanstack/react-query";
import {
  GetCourses,
  GetSemesters,
  GetYearLevels,
  OnboardingUpdateStudentInfo,
} from "../../components/Api/Api";
import { useDispatch } from "react-redux";
import { unsetOnboarding } from "../../features/redux/slices/StatusSlice/StatusSlice";
import { setUser } from "../../features/redux/slices/UserSlice/UserSlice";
export default function Onboarding() {
  const navigation = useNavigation<RootDrawerParamList>();
  const dispatch = useDispatch();
  // const creds = useSelector((state: RootState) => state.auth.creds);
  const [error, setError] = useState("");
  // Semesters
  const [selected_semester, setSelectedSemester] = useState("");
  const [semesterOpen, setSemesterOpen] = useState(false);
  const [semesters, setSemesters] = useState([
    { label: "1st Semester", value: "1st Sem" },
    { label: "2nd Semester", value: "2nd Sem" },
  ]);
  const semester_query = useQuery({
    queryKey: ["semesters"],
    queryFn: GetSemesters,
    onSuccess: (data) => {
      let semesters = data.map((item: SemesterParams) => ({
        label: item.name,
        value: item.name,
      }));
      setSemesters(semesters);
    },
  });
  // Year Level
  const [selected_yearlevel, setSelectedYearLevel] = useState("");
  const [yearLevelOpen, setYearLevelOpen] = useState(false);
  const [year_levels, setYearLevels] = useState([
    { label: "1st Year", value: "1st Year" },
    { label: "2nd Year", value: "2nd Year" },
  ]);
  const yearlevel_query = useQuery({
    queryKey: ["year_levels"],
    queryFn: GetYearLevels,
    onSuccess: (data) => {
      let year_levels = data.map((item: YearLevelParams) => ({
        label: item.name,
        value: item.name,
      }));
      setYearLevels(year_levels);
    },
  });
  // Course
  const [selected_course, setSelectedCourse] = useState("");
  const [courseOpen, setCourseOpen] = useState(false);
  const [courses, setCourses] = useState([
    {
      label: "Bachelor of Science in Information Technology",
      value: "BSIT",
    },
    { label: "Bachelor of Science in Computer Science", value: "BSCS" },
  ]);
  const course_query = useQuery({
    queryKey: ["courses"],
    queryFn: GetCourses,
    onSuccess: (data) => {
      let courses = data.map((item: CourseParams) => ({
        label: item.name,
        value: item.name,
      }));
      setCourses(courses);
    },
  });
  if (yearlevel_query.error || semester_query.error || course_query.error) {
    return (
      <View style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.text_white_medium}>Error loading details</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 600 }}
        >
          <Text style={styles.text_white_medium}>Welcome to Stud-E!</Text>
        </MotiView>
        <View style={{ paddingVertical: 4 }} />
        <View
          style={{
            paddingVertical: 4,
            marginBottom: 16,
            borderRadius: 4,
            width: "90%",
            backgroundColor: colors.blue_1,
          }}
        />
        <View style={{ paddingVertical: 4 }} />
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 1200, delay: 600 }}
        >
          <Text style={styles.text_white_small}>
            We're glad to have you on board {"\n"}
            Just a few more things before we get started
          </Text>
        </MotiView>
        <View style={{ paddingVertical: 8 }} />

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 400, delay: 1700 }}
        >
          <Text style={styles.text_white_medium}>Academic Info</Text>
          <DropDownPicker
            zIndex={3000}
            open={courseOpen}
            value={selected_course}
            items={courses}
            setOpen={(open) => {
              setCourseOpen(open);
              setSemesterOpen(false);
              setYearLevelOpen(false);
            }}
            setValue={setSelectedCourse}
            placeholder="Choose your course"
            containerStyle={{
              ...styles.dropdown_template,
              ...{ zIndex: 3000 },
            }}
            dropDownContainerStyle={{ backgroundColor: "white" }}
          />
          <DropDownPicker
            zIndex={2000}
            open={semesterOpen}
            value={selected_semester}
            items={semesters}
            setOpen={(open) => {
              setSemesterOpen(open);
              setCourseOpen(false);
              setYearLevelOpen(false);
            }}
            setValue={setSelectedSemester}
            placeholder="Current semester"
            containerStyle={{
              ...styles.dropdown_template,
              ...{ zIndex: 2000 },
            }}
            dropDownContainerStyle={{ backgroundColor: "white" }}
          />
          <DropDownPicker
            zIndex={1000}
            open={yearLevelOpen}
            value={selected_yearlevel}
            items={year_levels}
            setOpen={(open) => {
              setYearLevelOpen(open);
              setSemesterOpen(false);
              setCourseOpen(false);
            }}
            setValue={setSelectedYearLevel}
            placeholder="Your Year Level"
            containerStyle={{
              ...styles.dropdown_template,
              ...{ zIndex: 1000 },
            }}
            dropDownContainerStyle={{ backgroundColor: "white" }}
          />
        </MotiView>
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1, zIndex: -1 }}
          transition={{ type: "timing", duration: 400, delay: 1700 }}
          style={styles.button_template}
        >
          <Text style={styles.text_white_small}>{error}</Text>
          <Button
            disabled={
              !selected_yearlevel || !selected_course || !selected_semester
            }
            onPress={async () => {
              let result = await OnboardingUpdateStudentInfo({
                semester: selected_semester,
                course: selected_course,
                year_level: selected_yearlevel,
              });
              if (result[0]) {
                dispatch(unsetOnboarding());
                setSelectedCourse("");
                setSelectedYearLevel("");
                setSelectedSemester("");
                setError("Success!");
                dispatch(setUser(result[1]));
                navigation.navigate("Home");
              } else {
                setError(result[1]);
              }
            }}
            color={colors.blue_3}
          >
            <Text style={styles.text_white_small}>Proceed</Text>
          </Button>
        </MotiView>
      </View>
    </View>
  );
}

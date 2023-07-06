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
} from "../../components/Api/Api";
export default function Onboarding() {
  const navigation = useNavigation<RootDrawerParamList>();
  // const dispatch = useDispatch();
  // const creds = useSelector((state: RootState) => state.auth.creds);
  const [error, setError] = useState(false);
  // Semesters
  const [semester, setSemester] = useState("");
  const [semesterOpen, setSemesterOpen] = useState(false);
  const [semesters, setSemesters] = useState([
    { label: "1st Semester", value: "1st Sem", id: "" },
    { label: "2nd Semester", value: "2nd Sem", id: "" },
  ]);
  const semester_query = useQuery({
    queryKey: ["semesters"],
    queryFn: GetSemesters,
    onSuccess: (data) => {
      let semesters = data.map((item: SemesterParams) => ({
        label: item.name,
        value: item.shortname,
        id: item.id,
      }));
      setSemesters(semesters);
    },
    onError: () => {
      setError(true);
    },
  });
  // Year Level
  const [year_level, setYearLevel] = useState("");
  const [yearLevelOpen, setYearLevelOpen] = useState(false);
  const [year_levels, setYearLevels] = useState([
    { label: "1st Year", value: "1st Year", id: "" },
    { label: "2nd Year", value: "2nd Year", id: "" },
  ]);
  const yearlevel_query = useQuery({
    queryKey: ["year_levels"],
    queryFn: GetYearLevels,
    onSuccess: (data) => {
      let year_levels = data.map((item: YearLevelParams) => ({
        label: item.name,
        value: item.shortname,
        id: item.id,
      }));
      setYearLevels(year_levels);
    },
    onError: () => {
      setError(true);
    },
  });
  // Course
  const [course, setCourse] = useState("");
  const [courseOpen, setCourseOpen] = useState(false);
  const [courses, setCourses] = useState([
    {
      label: "Bachelor of Science in Information Technology",
      value: "BSIT",
      id: "",
    },
    { label: "Bachelor of Science in Computer Science", value: "BSCS", id: "" },
  ]);
  const [complete, setComplete] = useState(false);
  const course_query = useQuery({
    queryKey: ["courses"],
    queryFn: GetCourses,
    onSuccess: (data) => {
      let courses = data.map((item: CourseParams) => ({
        label: item.name,
        value: item.shortname,
        id: item.id,
      }));
      setCourses(courses);
    },
    onError: () => {
      setError(true);
    },
  });
  useEffect(() => {
    setComplete(
      !isStringEmpty(year_level) &&
        !isStringEmpty(course) &&
        !isStringEmpty(semester)
    );
  }, [year_level, course, semester, complete]);
  if (error) {
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
          transition={{ type: "timing", duration: 900, delay: 2000 }}
        >
          <Text style={styles.text_white_medium}>Academic Info</Text>
          <DropDownPicker
            zIndex={3000}
            open={courseOpen}
            value={course}
            items={courses}
            setOpen={(open) => {
              setCourseOpen(open);
              setSemesterOpen(false);
              setYearLevelOpen(false);
            }}
            setValue={setCourse}
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
            value={semester}
            items={semesters}
            setOpen={(open) => {
              setSemesterOpen(open);
              setCourseOpen(false);
              setYearLevelOpen(false);
            }}
            setValue={setSemester}
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
            value={year_level}
            items={year_levels}
            setOpen={(open) => {
              setYearLevelOpen(open);
              setSemesterOpen(false);
              setCourseOpen(false);
            }}
            setValue={setYearLevel}
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
          transition={{ type: "timing", duration: 900, delay: 2000 }}
          style={styles.button_template}
        >
          <Button
            disabled={!complete}
            onPress={() => console.log(complete)}
            color={colors.blue_3}
          >
            <Text style={styles.text_white_small}>Proceed</Text>
          </Button>
        </MotiView>
      </View>
    </View>
  );
}

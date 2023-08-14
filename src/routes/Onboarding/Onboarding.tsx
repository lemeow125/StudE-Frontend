import * as React from "react";
import styles from "../../styles";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  RootDrawerParamList,
  CourseType,
  SemesterType,
  YearLevelType,
} from "../../interfaces/Interfaces";
import { colors } from "../../styles";
import { MotiView } from "moti";
import { useState } from "react";
import Button from "../../components/Button/Button";
import DropDownPicker from "react-native-dropdown-picker";
import { useQuery } from "@tanstack/react-query";
import {
  GetCourses,
  GetSemesters,
  GetYearLevels,
  PatchUserInfo,
} from "../../components/Api/Api";
import { useDispatch } from "react-redux";
import { unsetOnboarding } from "../../features/redux/slices/StatusSlice/StatusSlice";
import { setUser } from "../../features/redux/slices/UserSlice/UserSlice";
import AnimatedContainerNoScroll from "../../components/AnimatedContainer/AnimatedContainerNoScroll";
import { useToast } from "react-native-toast-notifications";
export default function Onboarding() {
  const navigation = useNavigation<RootDrawerParamList>();
  const dispatch = useDispatch();
  // const creds = useSelector((state: RootState) => state.auth.creds);
  const toast = useToast();
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
      let semesters = data[1].map((item: SemesterType) => ({
        label: item.name,
        value: item.name,
      }));
      setSemesters(semesters);
    },
    onError: () => {
      toast.show("Server error: Unable to query available semesters", {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
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
      let year_levels = data[1].map((item: YearLevelType) => ({
        label: item.name,
        value: item.name,
      }));
      setYearLevels(year_levels);
    },
    onError: () => {
      toast.show("Server error: Unable to query available year levels", {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
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
      let courses = data[1].map((item: CourseType) => ({
        label: item.name,
        value: item.name,
      }));
      setCourses(courses);
    },
    onError: () => {
      toast.show("Server error: Unable to query available courses", {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
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
      <AnimatedContainerNoScroll>
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
            backgroundColor: colors.secondary_1,
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
            style={styles.input}
            setValue={setSelectedCourse}
            placeholder="Choose your course"
            containerStyle={{ zIndex: 3000 }}
            textStyle={{
              ...styles.text_white_small_bold,
              ...{ textAlign: "center" },
            }}
            dropDownContainerStyle={{ backgroundColor: colors.primary_2 }}
          />
          <DropDownPicker
            zIndex={2000}
            open={yearLevelOpen}
            value={selected_yearlevel}
            items={year_levels}
            setOpen={(open) => {
              setYearLevelOpen(open);
              setSemesterOpen(false);
              setCourseOpen(false);
            }}
            style={styles.input}
            setValue={setSelectedYearLevel}
            placeholder="Your Year Level"
            containerStyle={{ zIndex: 2000 }}
            textStyle={{
              ...styles.text_white_small_bold,
              ...{ textAlign: "center" },
            }}
            dropDownContainerStyle={{ backgroundColor: colors.primary_2 }}
          />
          <DropDownPicker
            zIndex={1000}
            open={semesterOpen}
            value={selected_semester}
            items={semesters}
            setOpen={(open) => {
              setSemesterOpen(open);
              setCourseOpen(false);
              setYearLevelOpen(false);
            }}
            style={styles.input}
            setValue={setSelectedSemester}
            placeholder="Current semester"
            containerStyle={{ zIndex: 1000 }}
            textStyle={{
              ...styles.text_white_small_bold,
              ...{ textAlign: "center" },
            }}
            dropDownContainerStyle={{ backgroundColor: colors.primary_2 }}
          />
        </MotiView>
        <MotiView
          from={{
            opacity: 0,
            zIndex: -1,
          }}
          animate={{
            opacity: 1,
            zIndex: -1,
          }}
          transition={{ type: "timing", duration: 400, delay: 1700 }}
          style={{
            ...styles.button_template,
            ...{ padding: 0, backgroundColor: colors.secondary_3 },
          }}
        >
          <Button
            disabled={
              !selected_yearlevel || !selected_course || !selected_semester
            }
            onPress={async () => {
              let result = await PatchUserInfo({
                semester: selected_semester,
                course: selected_course,
                year_level: selected_yearlevel,
              });
              if (result[0]) {
                dispatch(unsetOnboarding());
                setSelectedCourse("");
                setSelectedYearLevel("");
                setSelectedSemester("");
                dispatch(setUser(result[1]));
                toast.show("Changes applied successfully", {
                  type: "success",
                  placement: "top",
                  duration: 2000,
                  animationType: "slide-in",
                });
                navigation.navigate("Home");
              } else {
                dispatch(setUser(result[1]));
                toast.show(
                  "An error has occured\nChanges have not been saved",
                  {
                    type: "warning",
                    placement: "top",
                    duration: 2000,
                    animationType: "slide-in",
                  }
                );
              }
            }}
          >
            <Text style={styles.text_white_small}>Proceed</Text>
          </Button>
        </MotiView>
      </AnimatedContainerNoScroll>
    </View>
  );
}

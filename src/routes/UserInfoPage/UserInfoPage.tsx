import * as React from "react";
import styles from "../../styles";
import {
  View,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Pressable,
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
import AnimatedContainerNoScroll from "../../components/AnimatedContainer/AnimatedContainerNoScroll";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useSelector } from "react-redux";
import { RootState } from "../../features/redux/Store/Store";
import { useDispatch } from "react-redux";
import { setUser as setUserinState } from "../../features/redux/slices/UserSlice/UserSlice";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function UserInfoPage() {
  const logged_in_user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState("");
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
    irregular: false,
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
        student_id_number: data[1].student_id_number,
        irregular: data[1].irregular,
        avatar: data[1].avatar,
      });
      setSelectedCourse(data[1].course);
      setSelectedSemester(data[1].semester);
      setSelectedYearLevel(data[1].year_level);
      dispatch(setUserinState(data[1]));
    },
    onError: () => {
      setFeedback("Unable to query user info");
    },
  });
  const mutation = useMutation({
    mutationFn: PatchUserInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setFeedback("Changes applied successfully");
      dispatch(setUserinState(user));
    },
    onError: () => {
      setFeedback("An error has occured\nChanges have not been saved");
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
    onError: () => {
      setFeedback("Unable to query semester info");
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
    onError: () => {
      setFeedback("Unable to query year level info");
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
    onError: () => {
      setFeedback("Unable to query course info");
    },
  });

  // Profile photo
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const encodedImage = await FileSystem.readAsStringAsync(
        result.assets[0].uri,
        { encoding: "base64" }
      );
      mutation.mutate({
        avatar: encodedImage,
      });
    }
  };
  function Avatar() {
    if (user.avatar) {
      return (
        <Pressable onPress={pickImage}>
          <Image source={{ uri: user.avatar }} style={styles.profile} />
        </Pressable>
      );
    } else {
      return (
        <Pressable onPress={pickImage}>
          <Image
            source={require("../../img/user_profile_placeholder.png")}
            style={{ ...styles.profile, ...{ marginRight: 48 } }}
          />
        </Pressable>
      );
    }
  }

  return (
    <View style={styles.background}>
      <AnimatedContainerNoScroll>
        <View style={styles.flex_row}>
          <Avatar />
          <Text style={{ ...styles.text_white_small, ...{ marginLeft: 16 } }}>
            {(logged_in_user.first_name || "Undefined") +
              " " +
              (logged_in_user.last_name || "User") +
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
              onChange={(
                e: NativeSyntheticEvent<TextInputChangeEventData>
              ): void => {
                setUser({ ...user, first_name: e.nativeEvent.text });
                setFeedback("");
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
              onChange={(
                e: NativeSyntheticEvent<TextInputChangeEventData>
              ): void => {
                setUser({ ...user, last_name: e.nativeEvent.text });
                setFeedback("");
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
              onChangeValue={() => {
                setFeedback("");
              }}
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
              onChangeValue={() => {
                setFeedback("");
              }}
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
              onChangeValue={() => {
                setFeedback("");
              }}
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
          <View style={styles.flex_row}>
            <BouncyCheckbox
              onPress={() => {
                mutation.mutate({
                  irregular: !user.irregular,
                });
                setUser({ ...user, irregular: !user.irregular });
              }}
              isChecked={user.irregular}
              disableBuiltInState
              fillColor={colors.secondary_3}
            />
            <Text style={styles.text_white_small}>Irregular </Text>
          </View>
          <Button
            onPress={async () => {
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
            }}
          >
            <Text style={styles.text_white_small}>Save Changes</Text>
          </Button>
          <View style={styles.padding} />
          <Text style={styles.text_white_small}>{feedback}</Text>
        </View>
      </AnimatedContainerNoScroll>
    </View>
  );
}

import * as React from "react";
import styles from "../../styles";
import {
  View,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import {
  SemesterReturnType,
  UserInfoReturnType,
  SemesterType,
  YearLevelType,
  CourseType,
  OptionType,
  StudentStatusType,
  PatchUserInfoType,
  StudentStatusPatchType,
} from "../../interfaces/Interfaces";
import Button from "../../components/Button/Button";
import { Image } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetCourses,
  GetSemesters,
  GetYearLevels,
  PatchStudentStatus,
  PatchUserInfo,
  GetUserInfo,
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
import { useToast } from "react-native-toast-notifications";

export default function UserInfoPage() {
  const logged_in_user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const toast = useToast();

  // Student Status
  const studentstatus_mutation = useMutation({
    mutationFn: async (info: StudentStatusPatchType) => {
      const data = await PatchStudentStatus(info);
      if (data[0] != true) {
        return Promise.reject(new Error());
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["user_status"] });
    },
    onError: () => {
      toast.show("An error has occured\nChanges have not been saved", {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
    },
  });

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
    queryFn: async () => {
      const data = await GetUserInfo();
      if (data[0] == false) {
        return Promise.reject(new Error(data[1]));
      }
      return data;
    },
    onSuccess: (data: UserInfoReturnType) => {
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
    onError: (error: Error) => {
      toast.show(String(error), {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
    },
  });

  const mutation = useMutation({
    mutationFn: async (info: PatchUserInfoType) => {
      const data = await PatchUserInfo(info);
      if (data[0] == false) {
        return Promise.reject(new Error());
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      // Reset student status when changing user info to prevent bugs
      studentstatus_mutation.mutate({
        active: false,
      });
      toast.show("Changes applied successfully.\nStudent status reset", {
        type: "success",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
      dispatch(setUserinState(user));
    },
    onError: () => {
      toast.show("An error has occured\nChanges have not been saved", {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
    },
  });

  // Semester
  const [selected_semester, setSelectedSemester] = useState("");
  const [semesterOpen, setSemesterOpen] = useState(false);
  const [semesters, setSemesters] = useState<OptionType[]>([]);
  const Semesters = useQuery({
    queryKey: ["semesters"],
    queryFn: async () => {
      const data = await GetSemesters();
      if (data[0] == false) {
        return Promise.reject(new Error(data[1]));
      }
      return data;
    },
    onSuccess: (data: SemesterReturnType) => {
      let semestersData = data[1].map((semester: SemesterType) => ({
        label: semester.name,
        value: semester.name,
        shortname: semester.shortname,
      }));
      // Update the 'semesters' state
      setSemesters(semestersData);
    },
    onError: (error: Error) => {
      toast.show(String(error), {
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
  const [year_levels, setYearLevels] = useState<OptionType[]>([]);
  const yearlevel_query = useQuery({
    queryKey: ["year_levels"],
    queryFn: async () => {
      const data = await GetYearLevels();
      if (data[0] == false) {
        return Promise.reject(new Error(data[1]));
      }
      return data;
    },
    onSuccess: (data) => {
      let year_levels = data[1].map((yearlevel: YearLevelType) => ({
        label: yearlevel.name,
        value: yearlevel.name,
      }));
      setYearLevels(year_levels);
    },
    onError: (error: Error) => {
      toast.show(String(error), {
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
  const [courses, setCourses] = useState<OptionType[]>([]);
  const course_query = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const data = await GetCourses();
      if (data[0] == false) {
        return Promise.reject(new Error(data[1]));
      }
      return data;
    },
    onSuccess: (data) => {
      let courses = data[1].map((course: CourseType) => ({
        label: course.name,
        value: course.name,
      }));
      setCourses(courses);
    },
    onError: (error: Error) => {
      toast.show(String(error), {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
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
  if (
    StudentInfo.isLoading ||
    Semesters.isLoading ||
    yearlevel_query.isLoading ||
    course_query.isLoading
  ) {
    return (
      <View style={styles.background}>
        <AnimatedContainerNoScroll>
          <View style={{ paddingVertical: 8 }} />
          <ActivityIndicator size={96} color={colors.secondary_1} />
          <Text style={styles.text_white_medium}>Loading...</Text>
        </AnimatedContainerNoScroll>
      </View>
    );
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
          <View style={{ ...styles.flex_row, ...{ alignSelf: "center" } }}>
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
            onPress={() => {
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
        </View>
      </AnimatedContainerNoScroll>
    </View>
  );
}

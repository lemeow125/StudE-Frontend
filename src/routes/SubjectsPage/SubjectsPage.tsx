import * as React from "react";
import styles from "../../styles";
import { View, Text, ActivityIndicator } from "react-native";
import { useState } from "react";
import {
  UserInfoReturnType,
  SubjectsReturnType,
  SubjectType,
  OptionType,
  StudentStatusType,
  PatchUserInfoType,
  StudentStatusPatchType,
} from "../../interfaces/Interfaces";
import Button from "../../components/Button/Button";
import { Image } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetSubjects,
  PatchUserInfo,
  GetUserInfo,
  PatchStudentStatus,
} from "../../components/Api/Api";
import { colors } from "../../styles";
import DropDownPicker from "react-native-dropdown-picker";
import AnimatedContainerNoScroll from "../../components/AnimatedContainer/AnimatedContainerNoScroll";
import { useSelector } from "react-redux";
import { RootState } from "../../features/redux/Store/Store";
import { useToast } from "react-native-toast-notifications";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import Loading from "../Loading/Loading";
import LoadingFeedback from "../../components/LoadingFeedback/LoadingFeedback";

export default function SubjectsPage() {
  const logged_in_user = useSelector((state: RootState) => state.user.user);
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
    subjects: [] as string[],
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
      setSelectedSubjects(data[1].subjects);
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
      if (data[0] != true) {
        return Promise.reject(new Error());
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setSelectedSubjects([]);
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

  // Subjects

  const [selected_subjects, setSelectedSubjects] = useState<any>([]);
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [subjects, setSubjects] = useState<OptionType[]>([]);

  const Subjects = useQuery({
    enabled: StudentInfo.isFetched,
    queryKey: ["subjects"],
    queryFn: async () => {
      const data = await GetSubjects();
      if (data[0] == false) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data: SubjectsReturnType) => {
      if (data[1]) {
        let subjects = data[1].map((subject: SubjectType) => ({
          label: subject.name,
          value: subject.name,
        }));

        setSubjects(subjects);
      }
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
  if (StudentInfo.isLoading || Subjects.isLoading) {
    return <LoadingFeedback />;
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
              modalContentContainerStyle={{
                backgroundColor: colors.primary_2,
                borderWidth: 0,
                zIndex: 1000,
              }}
              autoScroll
              dropDownDirection="BOTTOM"
              listMode="MODAL"
            />
          </View>
        </View>
        <View style={{ zIndex: -1 }}>
          <View style={styles.padding} />
          <Button
            onPress={() => {
              mutation.mutate({
                subjects: selected_subjects,
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

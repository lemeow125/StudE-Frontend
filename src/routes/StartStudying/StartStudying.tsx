import * as React from "react";
import styles from "../../styles";
import { View, Text } from "react-native";
import { useState } from "react";
import {
  UserInfoParams,
  Subject,
  OptionType,
} from "../../interfaces/Interfaces";
import Button from "../../components/Button/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserInfo } from "../../components/Api/Api";
import { colors } from "../../styles";
import DropDownPicker from "react-native-dropdown-picker";
import AnimatedContainerNoScroll from "../../components/AnimatedContainer/AnimatedContainerNoScroll";
import { useSelector } from "react-redux";
import { RootState } from "../../features/redux/Store/Store";

export default function StartStudying({ route }: any) {
  const { location } = route.params;
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState("");

  // Subject choices
  const [selected_subject, setSelectedSubject] = useState("");
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [subjects, setSubjects] = useState<OptionType[]>([]);
  const StudentInfo = useQuery({
    queryKey: ["user"],
    queryFn: UserInfo,
    onSuccess: (data: UserInfoParams) => {
      let subjects = data[1].subjects.map((subject: string) => ({
        label: subject,
        value: subject,
      }));
      setSubjects(subjects);
    },
    onError: () => {
      setFeedback("Unable to query available subjects");
    },
  });
  if (location && location.coords) {
    return (
      <View style={styles.background}>
        <AnimatedContainerNoScroll>
          <View style={styles.flex_row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.text_white_small_bold}>Start Studying</Text>
            </View>
            <View style={{ flex: 3 }}>
              <DropDownPicker
                zIndex={1000}
                max={16}
                open={subjectsOpen}
                value={selected_subject}
                items={subjects}
                setOpen={(open) => {
                  setSubjectsOpen(open);
                }}
                setValue={setSelectedSubject}
                placeholderStyle={{
                  ...styles.text_white_tiny_bold,
                  ...{ textAlign: "left" },
                }}
                placeholder="Select subject"
                multipleText="Select subject"
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
            <Text style={styles.text_white_small}>
              {location.coords.longitude + "\n" + location.coords.latitude}
            </Text>
            <Button onPress={() => {}}>
              <Text style={styles.text_white_small}>Start Studying</Text>
            </Button>
            <View style={styles.padding} />
            <Text style={styles.text_white_small}>{feedback}</Text>
          </View>
        </AnimatedContainerNoScroll>
      </View>
    );
  }
  return <View />;
}

import * as React from "react";
import styles from "../../styles";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootDrawerParamList } from "../../interfaces/Interfaces";
import { colors } from "../../styles";
import { AnimatePresence, MotiView } from "moti";
import { useEffect, useState } from "react";
export default function Onboarding() {
  const navigation = useNavigation<RootDrawerParamList>();
  // const dispatch = useDispatch();
  // const creds = useSelector((state: RootState) => state.auth.creds);
  const [student_info, setStudentInfo] = useState({
    year_level: "",
    course: "",
    semester: "",
  });
  function Introduction() {
    const [shown, setShown] = useState(true);
    useEffect(() => {
      setTimeout(() => {
        setShown(false);
      }, 5000);
    }, []);
    return (
      <AnimatePresence>
        {shown && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            exitTransition={{ type: "timing", duration: 1200, delay: 600 }}
            transition={{ type: "timing", duration: 1200, delay: 600 }}
          >
            <Text style={styles.text_white_small}>
              We're glad to have you on board {"\n"}
              Just a few more things before we get started
            </Text>
          </MotiView>
        )}
      </AnimatePresence>
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
        <Introduction />
        <View style={{ paddingVertical: 8 }} />
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 900, delay: 2000 }}
        >
          <Text style={styles.text_white_medium}>Academic Info</Text>
        </MotiView>
      </View>
    </View>
  );
}

import React, { useEffect } from "react";
import { View } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import {
  GetStudentStatus,
  GetStudyGroupListFiltered,
  GetUserInfo,
} from "../Api/Api";
import { StudyGroupType } from "../../interfaces/Interfaces";

const FETCH_STUDENT_STATUS = "STUDENT_STATUS_TASK";

TaskManager.defineTask(FETCH_STUDENT_STATUS, async () => {
  const data = await GetStudyGroupListFiltered();
  const student_status_data = await GetStudentStatus();
  if (data[0] && data[1].length > -1) {
    console.log("Background Fetch", data[1]);
    const entryWithLeastDistance = data[1].reduce(
      (prev: StudyGroupType, curr: StudyGroupType) => {
        return prev.distance < curr.distance ? prev : curr;
      }
    );
    // Only display a notification if a student isn't in a study group yet
    if (
      student_status_data[1].study_group == null ||
      student_status_data[1].study_group == ""
    ) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Students are studying nearby",
          body: `Nearest study group is ${Math.round(
            entryWithLeastDistance.distance * 1000
          )}m away`,
        },
        trigger: {
          seconds: 1,
        },
      });
    }
  } else {
    console.log(data[1].response.data);
  }

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

const BackgroundComponent = () => {
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [status, setStatus] = React.useState<any>();
  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      FETCH_STUDENT_STATUS
    );
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  useEffect(() => {
    const registerTask = async () => {
      try {
        await checkStatusAsync();
        if (!isRegistered) {
          await BackgroundFetch.registerTaskAsync(FETCH_STUDENT_STATUS, {
            minimumInterval: 5, // seconds,
          });
          console.log("Task registered");
        } else {
          console.log("Task already registered");
        }
      } catch (err) {
        console.log("Task Register failed:", err);
      }
    };

    registerTask();
  }, []);

  return <View />;
};

export default BackgroundComponent;

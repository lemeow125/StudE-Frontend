import React, { useEffect } from "react";
import { View } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import {
  GetStudentStatus,
  GetStudyGroupListFiltered,
  GetStudyGroupMessages,
} from "../Api/Api";
import { StudyGroupType } from "../../interfaces/Interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FETCH_STUDENT_STATUS = "STUDENT_STATUS_TASK";
const FETCH_GROUP_MESSAGES = "GROUP_MESSAGES_TASK";

TaskManager.defineTask(FETCH_GROUP_MESSAGES, async () => {
  const data = await GetStudyGroupMessages();
  if (data[0] && data[1]) {
    let messages_prev = JSON.parse(
      (await AsyncStorage.getItem("messages")) || "{}"
    );
    if (!messages_prev) {
      await AsyncStorage.setItem("messages", JSON.stringify(data[1]));
    } else {
      let message_curr = data[1];
      let difference: Array<any> = messages_prev
        .filter((x: any) => !message_curr.includes(x))
        .concat(message_curr.filter((x: any) => !messages_prev.includes(x)));

      if (difference.length > 0) {
        console.log(`${difference.length} unread messages`);
        Notifications.scheduleNotificationAsync({
          content: {
            title: `${difference.length} unread messages`,
            body: `${difference[0].user}: ${difference[0].message_content}`,
          },
          trigger: {
            seconds: 1,
          },
        });
      }
    }
  } else {
    console.log(data[1].response.data);
  }

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

TaskManager.defineTask(FETCH_STUDENT_STATUS, async () => {
  const data = await GetStudyGroupListFiltered();
  const student_status_data = await GetStudentStatus();
  if (data[0] && data[1]) {
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
  const notification_debug = true;
  const [Task1_isRegistered, Task1_setIsRegistered] = React.useState(false);
  const [Task2_isRegistered, Task2_setIsRegistered] = React.useState(false);
  const [status, setStatus] = React.useState<any>();
  const checkStatusAsync = async () => {
    let status = await BackgroundFetch.getStatusAsync();
    setStatus(status);
    let Task1_isRegistered = await TaskManager.isTaskRegisteredAsync(
      FETCH_STUDENT_STATUS
    );
    let Task2_isRegistered = await TaskManager.isTaskRegisteredAsync(
      FETCH_GROUP_MESSAGES
    );
    Task1_setIsRegistered(Task1_isRegistered);
    Task2_setIsRegistered(Task2_isRegistered);
  };

  useEffect(() => {
    const registerTasks = async () => {
      try {
        await checkStatusAsync();
        // Nearby students task
        if (!Task1_isRegistered) {
          await BackgroundFetch.registerTaskAsync(FETCH_STUDENT_STATUS, {
            minimumInterval: notification_debug ? 5 : 60 * 3, // Check every 5 seconds in dev & every 3 minutes in production builds
          });
          console.log("Task for nearby students check registered");
        } else {
          console.log("Task for nearby students check already registered");
        }
        // Message Checking Task
        if (!Task2_isRegistered) {
          await BackgroundFetch.registerTaskAsync(FETCH_GROUP_MESSAGES, {
            minimumInterval: notification_debug ? 5 : 30, // Check every 5 seconds in dev & every 30 seconds in production builds
          });
          console.log("Task for group messages check registered");
        } else {
          console.log("Task for group messages check already registered");
        }
      } catch (err) {
        console.log("Task Register failed:", err);
      }
    };

    registerTasks();
  }, []);

  return <View />;
};

export default BackgroundComponent;

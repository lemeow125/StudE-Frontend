import * as React from "react";
import { View, Text } from "react-native";
import {
  StudentStatusFilterType,
  LocationType,
  subjectUserMapType,
  StudentStatusListType,
  StudentStatusFilterTypeFlattened,
} from "../../interfaces/Interfaces";
import { Double, Float } from "react-native/Libraries/Types/CodegenTypes";

export default function ParseStudentStatusList(data: any) {
  // Individual map point generation for student statuses
  // Include only those that do not have study groups
  // Then we simply flatten the data. Much simpler compared to study groups
  let data_filtered = data.filter(
    (item: StudentStatusFilterType) => item.study_group == ""
  );
  console.log("Filtered Data:", data_filtered);
  // Then we flatten the data so that all attributes are in the first layer
  // We first flatten the data to remove nested entries
  let data_flattened = data_filtered.map((item: StudentStatusFilterType) => ({
    active: item.active,
    distance: item.distance,
    landmark: item.landmark,
    latitude: item.location.latitude,
    longitude: item.location.longitude,
    study_group: item.study_group,
    subject: item.subject,
    user: item.user,
    weight: 1,
  }));

  return data_flattened;
}

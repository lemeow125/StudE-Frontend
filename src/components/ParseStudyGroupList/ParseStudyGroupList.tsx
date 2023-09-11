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

export default function ParseStudyGroupList(
  data: any,
  user_location: LocationType
) {
  // Circle generation for students in a study group
  let result: any[] = [];
  // We first remove any instances that do not have a study group associated with it
  let data_filtered = data.filter(
    (item: StudentStatusFilterType) => item.study_group !== ""
  );
  // console.log("Filtered Data:", data_filtered);
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
  // console.log("Flattened Data:", data_flattened);

  // We take from the array all unique subject names
  let unique_subjects = [
    ...new Set(
      data_flattened.map((item: StudentStatusFilterType) => item.subject)
    ),
  ];

  // Then we create arrays unique to each subject
  unique_subjects.forEach((subject, index: number) => {
    // We build another array for each subject, including only those instances that are the same subject name
    let unique_subject_list = data_flattened
      .filter(
        (item: StudentStatusFilterTypeFlattened) => item.subject === subject
      )
      .map((item: StudentStatusFilterTypeFlattened) => ({
        active: item.active,
        distance: item.distance,
        landmark: item.landmark,
        latitude: item.latitude,
        longitude: item.longitude,
        study_group: item.study_group,
        subject: item.subject,
        user: item.user,
        weight: 1,
      }));

    /*
    let unique_subject_object = data_flattened.filter(
      (item: StudentStatusFilterTypeFlattened) => item.subject === subject
    );
    */

    // We get the circle's center by averaging all the points
    // Calculate the average latitude and longitude
    const totalLat = unique_subject_list.reduce(
      (sum: Double, point: LocationType) => sum + point.latitude,
      0
    );
    const totalLng = unique_subject_list.reduce(
      (sum: Double, point: LocationType) => sum + point.longitude,
      0
    );

    let avgLat = totalLat / unique_subject_list.length;
    let avgLng = totalLng / unique_subject_list.length;

    // console.log("Center Latitude:", avgLat);
    // console.log("Center Longitude:", avgLng);

    // Haversine Distance Function
    function haversineDistance(
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ) {
      function toRad(x: number) {
        return (x * Math.PI) / 180;
      }

      lat1 = toRad(lat1);
      lon1 = toRad(lon1);
      lat2 = toRad(lat2);
      lon2 = toRad(lon2);

      let dLat = lat2 - lat1;
      let dLon = lon2 - lon1;

      let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      // Multiply by Earth's radius (in kilometers) to obtain distance
      let distance = 6371 * c;

      // Convert to meters
      return distance * 1000;
    }

    // We now calculate the radius of the circle using the Haversine Distance Formula
    // For each entry, we calculate the Haversine Distance from the user's location.
    // The largest value is used as the circle radius

    let circle_radius = Math.max(
      ...unique_subject_list.map(
        (item: StudentStatusFilterTypeFlattened, index: number) => {
          let distance = haversineDistance(
            item.latitude,
            item.longitude,
            user_location.latitude,
            user_location.longitude
          );

          /*console.log(
            "Haversine Distance for entry #",
            index + 1,
            ":",
            distance
          );*/
          return distance;
        }
      )
    );
    // console.log("Radius:", circle_radius);

    // We now build the object that we will return
    const subjectUserMap: subjectUserMapType = {
      subject: "",
      users: [],
      latitude: 0,
      longitude: 0,
      radius: 0,
    };
    unique_subject_list.forEach((item: StudentStatusFilterType) => {
      if (!subjectUserMap["users"]) {
        subjectUserMap["users"] = [];
      }
      subjectUserMap["subject"] = item.subject;
      subjectUserMap["latitude"] = avgLat;
      subjectUserMap["longitude"] = avgLng;
      subjectUserMap["radius"] = circle_radius;
      subjectUserMap["users"].push(item.user);
    });
    console.log(subjectUserMap);

    result = result.concat([subjectUserMap]);
  });

  // console.log("Final Result:", result);

  return result;
}

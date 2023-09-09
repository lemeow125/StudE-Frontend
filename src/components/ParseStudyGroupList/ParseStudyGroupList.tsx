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

export default function ParseStudyGroupList(data: any) {
  let result: any[] = [];
  // Circle generation for students in a study group
  // We first flatten the data to remove nested entries
  console.log("Initial Data:", data);
  let flattened_data = data
    .filter((item: StudentStatusFilterType) => item.study_group !== "")
    .map((item: StudentStatusFilterType) => ({
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
  console.log("Filtered Data:", flattened_data);

  // We get each unique subject
  let unique_subjects = [
    ...new Set(
      flattened_data.map((item: StudentStatusFilterType) => item.subject)
    ),
  ];

  // Then append all entries belonging to that subject to its own array
  unique_subjects.forEach((subject, index: number) => {
    index++;
    let filteredData = flattened_data.filter(
      (item: StudentStatusFilterTypeFlattened) => item.subject === subject
    );
    console.log("Subject #", index, "-", filteredData[0].subject, filteredData);
    // We get the circle's center by averaging all the points
    // Calculate the average latitude and longitude
    const totalLat = filteredData.reduce(
      (sum: Double, point: LocationType) => sum + point.latitude,
      0
    );
    const totalLng = filteredData.reduce(
      (sum: Double, point: LocationType) => sum + point.longitude,
      0
    );

    const avgLat = totalLat / filteredData.length;
    const avgLng = totalLng / filteredData.length;

    console.log("Center Latitude:", avgLat);
    console.log("Center Longitude:", avgLng);

    // We now calculate the radius of the circle using the Haversine Distance Formula

    function haversineDistance(
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ) {
      function toRad(x: number) {
        return (x * Math.PI) / 180;
      }

      var R = 6371; // km
      var x1 = lat2 - lat1;
      var dLat = toRad(x1);
      var x2 = lon2 - lon1;
      var dLon = toRad(x2);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d;
    }

    let circle_radius =
      Math.max(
        ...filteredData.map((item: StudentStatusFilterTypeFlattened) =>
          haversineDistance(avgLat, avgLng, item.latitude, item.longitude)
        )
      ) * 1000;
    console.log("Radius:", circle_radius);

    // We now build the object
    const subjectUserMap: subjectUserMapType = {
      subject: "",
      users: [],
      latitude: 0,
      longitude: 0,
      radius: 0,
    };
    filteredData.forEach((item: StudentStatusFilterType) => {
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

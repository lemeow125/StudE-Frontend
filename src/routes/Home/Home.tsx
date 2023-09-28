import styles, { Viewport, colors } from "../../styles";
import { View, Text } from "react-native";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import { useState, useEffect } from "react";
import MapView, {
  Callout,
  Heatmap,
  Circle,
  Marker,
  UrlTile,
  Overlay,
  Polygon,
} from "react-native-maps";
import * as Location from "expo-location";
import GetDistance from "../../components/GetDistance/GetDistance";
import Button from "../../components/Button/Button";
import {
  RootDrawerParamList,
  StudentStatusReturnType,
  RawLocationType,
  StudentStatusType,
  StudentStatusListReturnType,
  StudentStatusListType,
  subjectUserMapType,
  StudentStatusFilterTypeFlattened,
  StudentStatusPatchType,
  StudyGroupType,
  StudyGroupReturnType,
  StudentStatusFilterType,
  StudyGroupCreateType,
} from "../../interfaces/Interfaces";
import { useNavigation } from "@react-navigation/native";
import {
  CreateStudyGroup,
  GetStudentStatus,
  GetStudentStatusList,
  GetStudentStatusListFiltered,
  GetStudyGroupList,
  GetStudyGroupListFiltered,
  PatchStudentStatus,
  urlProvider,
} from "../../components/Api/Api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "react-native-toast-notifications";
import React from "react";
import CustomMapCallout from "../../components/CustomMapCallout/CustomMapCallout";
import MapRendererFar from "../../components/MapRenderer/MapRendererFar";
import GetDistanceFromUSTP from "../../components/GetDistance/GetDistanceFromUSTP";
import { useSelector } from "react-redux";
import { RootState } from "../../features/redux/Store/Store";

export default function Home() {
  // Switch this condition to see the main map when debugging
  const map_debug = true;
  const user_state = useSelector((state: RootState) => state.user);
  const navigation = useNavigation<RootDrawerParamList>();
  const [location, setLocation] = useState<RawLocationType | null>(null);
  const [dist, setDist] = useState<number | null>(null);
  const [feedback, setFeedback] = useState(
    "To continue, please allow Stud-E permission to location services"
  );
  const queryClient = useQueryClient();
  const toast = useToast();

  const ustpCoords = {
    latitude: 8.4857,
    longitude: 124.6565,
    latitudeDelta: 0.000235,
    longitudeDelta: 0.000067,
  };
  async function requestLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setFeedback("Allow location permissions to continue");
      toast.show(
        "Location permission was denied. Please allow in order to use StudE",
        {
          type: "warning",
          placement: "top",
          duration: 2000,
          animationType: "slide-in",
        }
      );
      return;
    }
    if (status == "granted") {
      let newLocation = await Location.getCurrentPositionAsync({});
      if (newLocation) {
        // Only update location state if user's location has changed
        if (
          !location ||
          newLocation.coords.latitude !== location.coords.latitude ||
          newLocation.coords.longitude !== location.coords.longitude
        ) {
          setLocation(newLocation);
          DistanceHandler(newLocation);
        }
      }
    }
  }

  // Refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      requestLocation();
    }, 15000);

    return () => clearInterval(interval);
  });

  // Refresh when screen loads
  useEffect(() => {
    requestLocation();
  }, []);

  async function DistanceHandler(location: RawLocationType) {
    let dist = GetDistanceFromUSTP(location.coords);
    setDist(dist);
    // Deactivate student status if too far away
    if (dist >= 2 && !map_debug)
      mutation.mutate({
        active: false,
      });
  }

  // Student Status
  const [studying, setStudying] = useState(false);
  const [subject, setSubject] = useState("");
  const [buttonLabel, setButtonLabel] = useState("Start studying");
  const [student_status, setStudentStatus] = useState<StudentStatusType>();
  const StudentStatusQuery = useQuery({
    queryKey: ["user_status"],
    queryFn: async () => {
      const data = await GetStudentStatus();
      if (data[0] == false) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data: StudentStatusReturnType) => {
      if (data[1].active !== undefined) {
        setStudying(data[1].active);
      }
      if (data[1].subject !== undefined) {
        setSubject(data[1].subject);
      }
      if (data[1].active == true) {
        setButtonLabel("Stop Studying");
      } else if (data[1].active == false) {
        setButtonLabel("Start Studying");
      }
      setStudentStatus(data[1]);
      console.log(student_status);
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
      toast.show("You are no longer studying  \n" + subject, {
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

  const study_group_create = useMutation({
    mutationFn: async (info: StudyGroupCreateType) => {
      const data = await CreateStudyGroup(info);
      if (data[0] != true) {
        return Promise.reject(new Error());
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["user_status"] });
      toast.show("Created successfully", {
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

  const [student_statuses, setStudentStatuses] =
    useState<StudentStatusListType>([]);
  // Student Status List
  const StudentStatusListQuery = useQuery({
    enabled: studying,
    queryKey: ["user_status_list"],
    queryFn: async () => {
      const data = await GetStudentStatusListFiltered();
      if (data[0] == false) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data: StudentStatusListReturnType) => {
      if (data[1] && location) {
        // Filter to only include students studying solo
        let data_filtered = data[1].filter(
          (item: StudentStatusFilterType) => item.study_group == ""
        );
        setStudentStatuses(data_filtered);
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

  const [study_groups, setStudyGroups] = useState<StudyGroupType[]>([]);
  // Student Status List
  const StudyGroupQuery = useQuery({
    enabled: studying,
    queryKey: ["study_group_list"],
    queryFn: async () => {
      const data = await GetStudyGroupListFiltered();
      if (data[0] == false) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data: StudyGroupReturnType) => {
      if (data[1] && location) {
        setStudyGroups(data[1]);
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
  const [study_groups_global, setStudyGroupsGlobal] = useState<
    StudyGroupType[]
  >([]);
  // Student Status List
  const StudyGroupGlobalQuery = useQuery({
    enabled: !studying,
    queryKey: ["study_group_list_global"],
    queryFn: async () => {
      const data = await GetStudyGroupList();
      if (data[0] == false) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data: StudyGroupReturnType) => {
      if (data[1] && location) {
        setStudyGroupsGlobal(data[1]);
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

  function CustomMap() {
    if (dist && location) {
      if (dist <= 2 || map_debug) {
        return (
          <View>
            <MapView
              style={styles.map}
              customMapStyle={[
                {
                  featureType: "poi",
                  stylers: [
                    {
                      visibility: "off",
                    },
                  ],
                },
              ]}
              scrollEnabled={true}
              zoomEnabled={true}
              toolbarEnabled={false}
              rotateEnabled={false}
              maxZoomLevel={19}
              minZoomLevel={19}
              zoomTapEnabled
              initialRegion={{
                latitude:
                  student_status?.location?.latitude ||
                  location.coords.latitude,
                longitude:
                  student_status?.location?.longitude ||
                  location.coords.longitude,
                latitudeDelta: 0.4,
                longitudeDelta: 0.4,
              }}
              loadingBackgroundColor={colors.secondary_2}
            >
              {student_statuses.map(
                (student_status: StudentStatusFilterType, index: number) => {
                  const randomColorWithOpacity = `rgba(${Math.floor(
                    Math.random() * 256
                  )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
                    Math.random() * 256
                  )}, 0.7)`;

                  return (
                    <Marker
                      key={index}
                      coordinate={student_status.location}
                      pinColor={randomColorWithOpacity}
                      zIndex={1000}
                      onPress={() => {
                        toast.hideAll();
                        toast.show(
                          <View
                            style={{
                              alignContent: "center",
                              alignSelf: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={styles.text_white_tiny_bold}>
                              Student: {student_status.user}
                            </Text>
                            <Text style={styles.text_white_tiny_bold}>
                              Studying Subject: {student_status.subject}
                            </Text>
                          </View>,
                          {
                            type: "normal",
                            placement: "top",
                            duration: 2000,
                            animationType: "slide-in",
                            style: {
                              backgroundColor: colors.secondary_2,
                              borderWidth: 1,
                              borderColor: colors.primary_1,
                            },
                          }
                        );
                      }}
                    />
                  );
                }
              )}
              {study_groups.map((studygroup: StudyGroupType, index: number) => {
                const randomColorWithOpacity = `rgba(${Math.floor(
                  Math.random() * 256
                )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
                  Math.random() * 256
                )}, 0.7)`;

                return (
                  <React.Fragment key={index}>
                    <Marker
                      coordinate={studygroup.location}
                      pinColor={randomColorWithOpacity}
                      zIndex={1000}
                      onPress={() => {
                        toast.hideAll();
                        toast.show(
                          <View
                            style={{
                              alignContent: "center",
                              alignSelf: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={styles.text_white_tiny_bold}>
                              Subject: {studygroup.subject}
                            </Text>
                            <Text style={styles.text_white_tiny_bold}>
                              Students Studying: {studygroup.students.length}
                            </Text>
                            <Button
                              onPress={() => {
                                toast.show("Joined successfully", {
                                  type: "success",
                                  placement: "top",
                                  duration: 2000,
                                  animationType: "slide-in",
                                });
                              }}
                            >
                              <Text style={styles.text_white_tiny_bold}>
                                Join Group
                              </Text>
                            </Button>
                          </View>,
                          {
                            type: "normal",
                            placement: "top",
                            duration: 2000,
                            animationType: "slide-in",
                            style: {
                              backgroundColor: colors.secondary_2,
                              borderWidth: 1,
                              borderColor: colors.primary_1,
                            },
                          }
                        );
                      }}
                    />
                    <Circle
                      center={studygroup.location}
                      radius={studygroup.radius}
                      fillColor={randomColorWithOpacity}
                      strokeColor="white"
                      zIndex={1000}
                    />
                  </React.Fragment>
                );
              })}
              {study_groups_global.map(
                (studygroup: StudyGroupType, index: number) => {
                  const randomColorWithOpacity = `rgba(${Math.floor(
                    Math.random() * 256
                  )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
                    Math.random() * 256
                  )}, 0.7)`;

                  return (
                    <React.Fragment key={index}>
                      <Marker
                        coordinate={studygroup.location}
                        pinColor={randomColorWithOpacity}
                        zIndex={1000}
                        onPress={() => {
                          toast.hideAll();
                          toast.show(
                            <View
                              style={{
                                alignContent: "center",
                                alignSelf: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text style={styles.text_white_tiny_bold}>
                                Subject: {studygroup.subject}
                              </Text>
                              <Text style={styles.text_white_tiny_bold}>
                                Students Studying: {studygroup.students.length}
                              </Text>
                              <Button
                                onPress={() => {
                                  toast.show("Joined successfully", {
                                    type: "success",
                                    placement: "top",
                                    duration: 2000,
                                    animationType: "slide-in",
                                  });
                                }}
                              >
                                <Text style={styles.text_white_tiny_bold}>
                                  Join Group
                                </Text>
                              </Button>
                            </View>,
                            {
                              type: "normal",
                              placement: "top",
                              duration: 2000,
                              animationType: "slide-in",
                              style: {
                                backgroundColor: colors.secondary_2,
                                borderWidth: 1,
                                borderColor: colors.primary_1,
                              },
                            }
                          );
                        }}
                      />
                      <Circle
                        center={studygroup.location}
                        radius={studygroup.radius}
                        fillColor={randomColorWithOpacity}
                        strokeColor="white"
                        zIndex={1000}
                      />
                    </React.Fragment>
                  );
                }
              )}
              <Marker
                zIndex={1001}
                coordinate={{
                  latitude:
                    student_status?.location?.latitude ||
                    location.coords.latitude,
                  longitude:
                    student_status?.location?.longitude ||
                    location.coords.longitude,
                }}
                draggable={!student_status?.active}
                onDragEnd={(e) => {
                  const newLocation = e.nativeEvent.coordinate;
                  const distance = GetDistance(
                    newLocation.latitude,
                    newLocation.longitude,
                    location.coords.latitude,
                    location.coords.longitude
                  );
                  if (distance <= 0.1) {
                    // If the new location is within 100 meters of the actual location, update the location state
                    setLocation({
                      ...location,
                      coords: {
                        ...location.coords,
                        latitude: newLocation.latitude,
                        longitude: newLocation.longitude,
                      },
                    });
                  } else {
                    // If the new location is more than 100 meters away from the actual location, reset the marker to the actual location
                    setLocation({
                      ...location,
                    });
                  }
                }}
                pinColor={colors.primary_1}
                onPress={() => {
                  toast.hideAll();
                  toast.show(
                    <View
                      style={{
                        alignContent: "center",
                        alignSelf: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={styles.text_white_tiny_bold}>
                        You are here
                      </Text>

                      <Text style={styles.text_white_tiny_bold}>
                        {"x: " +
                          (student_status?.location?.longitude != undefined
                            ? student_status?.location?.longitude.toFixed(4)
                            : location.coords.longitude.toFixed(4))}
                      </Text>
                      <Text style={styles.text_white_tiny_bold}>
                        {"y: " +
                          (student_status?.location?.latitude != undefined
                            ? student_status?.location?.latitude.toFixed(4)
                            : location.coords.latitude.toFixed(4))}
                      </Text>
                      {student_status?.active &&
                      !student_status?.study_group ? (
                        <>
                          <Text style={styles.text_white_tiny_bold}>
                            {student_status?.active
                              ? "Studying " + student_status?.subject
                              : ""}
                          </Text>
                          <Button
                            onPress={() => {
                              if (student_status?.subject) {
                                console.log({
                                  location: {
                                    latitude: student_status?.location.latitude,
                                    longitude:
                                      student_status?.location.longitude,
                                  },
                                  subject: student_status?.subject,
                                });
                                navigation.navigate("Create Group", {
                                  location: {
                                    latitude: student_status?.location.latitude,
                                    longitude:
                                      student_status?.location.longitude,
                                  },
                                  subject: student_status?.subject,
                                });
                              }
                            }}
                          >
                            <Text style={styles.text_white_tiny_bold}>
                              Create Group
                            </Text>
                          </Button>
                        </>
                      ) : (
                        <></>
                      )}
                      {student_status?.study_group ? (
                        <>
                          <Text style={styles.text_white_tiny_bold}>
                            {`Studying ${student_status?.subject}`}
                          </Text>
                          <Text style={styles.text_white_tiny_bold}>
                            {`In group ${student_status?.study_group}`}
                          </Text>
                        </>
                      ) : (
                        <></>
                      )}
                    </View>,
                    {
                      type: "normal",
                      placement: "top",
                      duration: 2000,
                      animationType: "slide-in",
                      style: {
                        backgroundColor: colors.secondary_2,
                        borderWidth: 1,
                        borderColor: colors.primary_1,
                      },
                    }
                  );
                }}
              ></Marker>
            </MapView>
            <Button
              onPress={async () => {
                if (!student_status?.active) {
                  navigation.navigate("Start Studying", { location: location });
                } else {
                  mutation.mutate({
                    active: false,
                  });
                }
              }}
            >
              <Text style={styles.text_white_medium}>{buttonLabel}</Text>
            </Button>
          </View>
        );
      } else {
        return <MapRendererFar location={location.coords} dist={dist} />;
      }
    } else {
      requestLocation();
      return (
        <AnimatedContainer>
          <Text style={styles.text_white_medium}>{feedback}</Text>
          <Button onPress={requestLocation}>
            <Text style={styles.text_white_medium}>Allow Access</Text>
          </Button>
        </AnimatedContainer>
      );
    }
  }
  return (
    <View style={styles.background}>
      <AnimatedContainer>
        <CustomMap />
      </AnimatedContainer>
    </View>
  );
}

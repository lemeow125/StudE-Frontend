import styles, { colors } from "../../styles";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Switch,
  ActivityIndicator,
} from "react-native";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import { useState, useEffect } from "react";
import MapView, { Circle, Marker, UrlTile } from "react-native-maps";
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
  StudentStatusPatchType,
  StudyGroupType,
  StudyGroupReturnType,
  StudentStatusFilterType,
} from "../../interfaces/Interfaces";
import { useNavigation } from "@react-navigation/native";
import {
  GetStudentStatus,
  GetStudentStatusList,
  GetStudentStatusListNear,
  GetStudyGroupList,
  GetStudyGroupListFiltered,
  PatchStudentStatus,
  urlProvider,
} from "../../components/Api/Api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "react-native-toast-notifications";
import React from "react";
import MapRendererFar from "../../components/MapRenderer/MapRendererFar";
import GetDistanceFromUSTP from "../../components/GetDistance/GetDistanceFromUSTP";
import Modal from "react-native-modal";
import DropdownIcon from "../../icons/CaretDownIcon/CaretDownIcon";
import CaretUpIcon from "../../icons/CaretUpIcon/CaretUpIcon";
import RefreshIcon from "../../icons/RefreshIcon/RefreshIcon";

export default function Home() {
  // Switch this condition to see the main map when debugging
  const map_distance_override = false;
  const navigation = useNavigation<RootDrawerParamList>();
  const [location, setLocation] = useState<RawLocationType | null>(null);
  const [locationPermitted, setLocationPermitted] = useState(false);
  const [dist, setDist] = useState<number | null>(null);
  const [feedback, setFeedback] = useState(
    "To continue, please allow Stud-E permission to location services"
  );
  const queryClient = useQueryClient();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalByGroup, setModalByGroup] = useState(false);

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
      if (locationPermitted === false) {
        setLocationPermitted(true);
      }

      let newLocation = await Location.getCurrentPositionAsync();
      if (newLocation) {
        // Only update location state if user's location has changed
        if (
          !location ||
          newLocation.coords.latitude !== location.coords.latitude ||
          newLocation.coords.longitude !== location.coords.longitude
        ) {
          setLocation(newLocation);
          await DistanceHandler(newLocation);
        }
      }
    }
  }

  // Refresh every 10 seconds
  requestLocation();
  useEffect(() => {
    const interval = setInterval(() => {
      requestLocation();
    }, 10000);
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["user_status"] });
      queryClient.invalidateQueries({
        queryKey: ["user_status_list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["study_group_list"],
      });
    }, 2000);
    requestLocation();
    return () => clearInterval(interval);
  }, []);

  const [stopping_toofar, setStopping] = useState(false);
  async function DistanceHandler(location: RawLocationType) {
    let dist = GetDistanceFromUSTP(location.coords);
    setDist(dist);
    // Deactivate student status if too far away and still studying
    if (dist >= 2 && !map_distance_override && studying) {
      if (!stopping_toofar) {
        stop_studying.mutate({
          active: false,
        });
      }
      setStopping(true);
    }
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
      if (data[1].active == true) {
        setButtonLabel("Stop Studying");
      } else if (data[1].active == false) {
        setButtonLabel("Start Studying");
      }
      setSubject(data[1].subject);
      setStudying(data[1].active);
      setStudentStatus(data[1]);
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

  const stop_studying = useMutation({
    mutationFn: async (info: StudentStatusPatchType) => {
      const data = await PatchStudentStatus(info);
      if (data[0] != true) {
        return Promise.reject(new Error());
      }
      return data;
    },
    onSuccess: () => {
      if (student_status?.study_group) {
        // Display separate toast if you stop studying while in a study group
        toast.show("You left study group  \n" + student_status?.study_group, {
          type: "success",
          placement: "top",
          duration: 2000,
          animationType: "slide-in",
        });
      }
      toast.show("You are no longer studying  \n" + subject, {
        type: "success",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
      queryClient.invalidateQueries({ queryKey: ["user_status"] });
      // Delay refetching for study groups since backend still needs to delete groups without students after leaving a study group
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["study_group_list"] });
        queryClient.invalidateQueries({
          queryKey: ["study_group_list_global"],
        });
      }, 500);
      setStudyGroups([]);
      setStudying(false);
      if (stopping_toofar) {
        setStopping(false);
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

  const change_study_group = useMutation({
    mutationFn: async (info: StudentStatusPatchType) => {
      const data = await PatchStudentStatus(info);
      if (data[0] != true) {
        return Promise.reject(new Error());
      }
      return data;
    },
    onSuccess: () => {
      if (student_status?.study_group) {
        // Display separate toast if you stop studying while in a study group
        toast.show("You left study group  \n" + student_status?.study_group, {
          type: "success",
          placement: "top",
          duration: 2000,
          animationType: "slide-in",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["user_status"] });

      // Delay refetching for study groups since backend still needs to delete groups without students after leaving a study group
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["study_group_list"] });
        queryClient.invalidateQueries({
          queryKey: ["study_group_list_global"],
        });
      }, 500);
      setStudyGroups([]);
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
    enabled: studying && !StudentStatusQuery.isLoading,
    queryKey: ["user_status_list"],
    queryFn: async () => {
      const data = await GetStudentStatusListNear();
      if (data[0] == false) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data: StudentStatusListReturnType) => {
      if (data[1] && location) {
        // Filter to only include students studying solo
        let data_filtered = data[1].filter(
          (item: StudentStatusFilterType) => item.study_group == null
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

  const [student_statuses_global, setStudentStatusesGlobal] =
    useState<StudentStatusListType>([]);
  // Student Status List Global
  const StudentStatusListGlobalQuery = useQuery({
    enabled: !studying && !StudentStatusQuery.isLoading,
    queryKey: ["user_status_list_global"],
    queryFn: async () => {
      const data = await GetStudentStatusList();
      if (data[0] == false) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data: StudentStatusListReturnType) => {
      if (data[1] && location) {
        // Filter to only include students studying solo
        let data_filtered = data[1].filter(
          (item: StudentStatusFilterType) => item.study_group == null
        );
        setStudentStatusesGlobal(data_filtered);
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
  // Study Group List
  const StudyGroupQuery = useQuery({
    enabled: studying && !StudentStatusQuery.isLoading,
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
  // Study Group Global List
  const StudyGroupGlobalQuery = useQuery({
    enabled: !studying && !StudentStatusQuery.isLoading,
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
    if (!locationPermitted) {
      return (
        <>
          <Text style={styles.text_white_medium}>{feedback}</Text>
          <Button onPress={async () => await requestLocation()}>
            <Text style={styles.text_white_medium}>Allow Access</Text>
          </Button>
        </>
      );
    } else if (dist && location) {
      if (dist <= 1 || map_distance_override) {
        if (
          (StudentStatusQuery.isFetching && studying) ||
          StudentStatusListQuery.isFetching ||
          StudyGroupQuery.isFetching ||
          (StudentStatusQuery.isFetching && !studying) ||
          StudentStatusListGlobalQuery.isFetching ||
          StudyGroupGlobalQuery.isFetching
        ) {
          return (
            <>
              <View style={{ paddingVertical: 8 }} />
              <ActivityIndicator size={96} color={colors.secondary_1} />
              <Text style={styles.text_white_medium}>Loading...</Text>
            </>
          );
        }
        return (
          <>
            <View style={{ alignSelf: "flex-end" }}>
              <Pressable
                onPress={() => {
                  queryClient.invalidateQueries({ queryKey: ["user"] });
                  queryClient.invalidateQueries({ queryKey: ["user_status"] });
                  queryClient.invalidateQueries({
                    queryKey: ["user_status_list"],
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["study_group_list"],
                  });
                }}
              >
                <RefreshIcon size={32} />
              </Pressable>
            </View>
            <MapView
              mapType={"none"}
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
              <UrlTile
                urlTemplate={urlProvider}
                shouldReplaceMapContent={true}
                maximumZ={19}
                flipY={false}
                zIndex={1}
              />
              {!studying ? (
                student_statuses_global.map(
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
                                {`Studying ${student_status.subject}`}
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
                )
              ) : (
                <></>
              )}
              {studying ? (
                student_statuses.map(
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
                                {`Studying ${student_status.subject}`}
                              </Text>
                              <Text style={styles.text_white_tiny_bold}>
                                {`${Math.round(
                                  student_status.distance * 1000
                                )}m away`}
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
                )
              ) : (
                <></>
              )}
              {studying ? (
                study_groups.map(
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
                                  Study Group: {studygroup.name}
                                </Text>
                                <Text style={styles.text_white_tiny_bold}>
                                  {`Studying ${studygroup.subject}`}
                                </Text>

                                <Text style={styles.text_white_tiny_bold}>
                                  {`${studygroup.students.length} ${
                                    studygroup.students.length > 1
                                      ? "students"
                                      : "student"
                                  } studying`}
                                </Text>
                                <Text style={styles.text_white_tiny_bold}>
                                  {`${Math.round(
                                    studygroup.distance * 1000
                                  )}m away`}
                                </Text>
                                {student_status?.study_group !=
                                studygroup.name ? (
                                  <Button
                                    onPress={() => {
                                      change_study_group.mutate({
                                        study_group: studygroup.name,
                                        subject: studygroup.subject,
                                      });
                                    }}
                                  >
                                    <Text style={styles.text_white_tiny_bold}>
                                      Join Group
                                    </Text>
                                  </Button>
                                ) : (
                                  <></>
                                )}
                                {student_status?.study_group ==
                                studygroup.name ? (
                                  <Button
                                    onPress={() => {
                                      change_study_group.mutate({
                                        study_group: "",
                                      });
                                    }}
                                  >
                                    <Text style={styles.text_white_tiny_bold}>
                                      Leave Group
                                    </Text>
                                  </Button>
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
                )
              ) : (
                <></>
              )}
              {!studying ? (
                study_groups_global.map(
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
                                  Study Group: {studygroup.name}
                                </Text>
                                <Text style={styles.text_white_tiny_bold}>
                                  {`Studying ${studygroup.subject}`}
                                </Text>
                                <Text style={styles.text_white_tiny_bold}>
                                  {`${studygroup.students.length} ${
                                    studygroup.students.length > 1
                                      ? "students"
                                      : "student"
                                  } studying`}
                                </Text>
                                {student_status?.study_group !=
                                studygroup.name ? (
                                  <Text style={styles.text_white_tiny_bold}>
                                    Study nearby to join
                                  </Text>
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
                )
              ) : (
                <></>
              )}
              {!studying || !student_status?.study_group ? (
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
                                  navigation.navigate("Create Group", {
                                    location: {
                                      latitude:
                                        student_status?.location.latitude,
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
                              {`Studying: ${student_status?.subject}`}
                            </Text>
                            <Text style={styles.text_white_tiny_bold}>
                              {`In group: ${student_status?.study_group}`}
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
              ) : (
                <></>
              )}
            </MapView>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Button
                onPress={async () => {
                  if (!student_status?.active) {
                    navigation.navigate("Start Studying", {
                      location: location,
                    });
                  } else {
                    stop_studying.mutate({
                      active: false,
                    });
                  }
                }}
              >
                <Text style={styles.text_white_small}>{buttonLabel}</Text>
              </Button>
              <Pressable
                style={{
                  display: modalOpen ? "none" : "flex",
                  backgroundColor: colors.secondary_3,
                  borderRadius: 16,
                  alignSelf: "center",
                }}
                onPress={() => {
                  setModalOpen(true);
                }}
              >
                {studying ? <CaretUpIcon size={32} /> : <></>}
              </Pressable>
            </View>

            <View style={styles.padding} />
          </>
        );
      } else {
        return <MapRendererFar location={location.coords} dist={dist} />;
      }
    } else {
      return (
        <>
          <View style={{ paddingVertical: 8 }} />
          <ActivityIndicator size={96} color={colors.secondary_1} />
          <Text style={styles.text_white_medium}>Loading...</Text>
        </>
      );
    }
  }
  return (
    <View style={styles.background}>
      <Modal
        coverScreen={false}
        isVisible={modalOpen && studying}
        style={{ opacity: 0.85 }}
        hasBackdrop={false}
      >
        <AnimatedContainer>
          <Pressable
            style={{
              alignContent: "flex-start",
              backgroundColor: colors.secondary_3,
              borderRadius: 16,
            }}
            onPress={() => setModalOpen(false)}
          >
            <DropdownIcon size={32} />
          </Pressable>
          <View style={styles.flex_row}>
            <Switch
              value={modalByGroup}
              onChange={() => {
                setModalByGroup(!modalByGroup);
              }}
            />
            <Text style={styles.text_white_medium}>List View</Text>
          </View>

          <ScrollView>
            {!modalByGroup ? (
              student_statuses.map(
                (student_status: StudentStatusFilterType, index: number) => {
                  return (
                    <View
                      key={index}
                      style={{
                        alignContent: "center",
                        alignSelf: "center",
                        justifyContent: "center",
                        backgroundColor: colors.secondary_3,
                        borderColor: colors.primary_2,
                        borderWidth: 1,
                        borderRadius: 16,
                        width: 256,
                      }}
                    >
                      <Text style={styles.text_white_tiny_bold}>
                        Student: {student_status.user}
                      </Text>
                      <Text style={styles.text_white_tiny_bold}>
                        {`Studying ${student_status.subject}`}
                      </Text>
                      <Text style={styles.text_white_tiny_bold}>
                        {`${Math.round(student_status.distance * 1000)}m away`}
                      </Text>
                    </View>
                  );
                }
              )
            ) : (
              <></>
            )}
            {modalByGroup ? (
              study_groups.map((studygroup: StudyGroupType, index: number) => {
                return (
                  <View
                    key={index}
                    style={{
                      alignContent: "center",
                      alignSelf: "center",
                      justifyContent: "center",
                      backgroundColor: colors.secondary_3,
                      borderColor: colors.primary_2,
                      borderWidth: 1,
                      borderRadius: 16,
                      width: 256,
                    }}
                  >
                    <Text style={styles.text_white_tiny_bold}>
                      Group Name: {studygroup.name}
                    </Text>
                    <Text style={styles.text_white_tiny_bold}>
                      {`Studying ${studygroup.subject}`}
                    </Text>
                    <Text style={styles.text_white_tiny_bold}>
                      Students Studying: {studygroup.students.length}
                    </Text>
                    {student_status?.study_group != studygroup.name ? (
                      <Text style={styles.text_white_tiny_bold}>
                        {`${Math.round(studygroup.distance * 1000)}m away`}
                      </Text>
                    ) : (
                      <></>
                    )}
                    {student_status?.study_group != studygroup.name ? (
                      <Pressable
                        style={{
                          ...styles.button_template,
                          backgroundColor: colors.secondary_2,
                        }}
                        onPress={() => {
                          change_study_group.mutate({
                            study_group: studygroup.name,
                            subject: studygroup.subject,
                          });
                          setModalOpen(!modalOpen);
                        }}
                      >
                        <Text style={styles.text_white_tiny_bold}>
                          Join Group
                        </Text>
                      </Pressable>
                    ) : (
                      <></>
                    )}
                    {student_status?.study_group == studygroup.name ? (
                      <Pressable
                        style={{
                          ...styles.button_template,
                          backgroundColor: colors.secondary_2,
                        }}
                        onPress={() => {
                          change_study_group.mutate({
                            study_group: "",
                          });
                          setModalOpen(!modalOpen);
                        }}
                      >
                        <Text style={styles.text_white_tiny_bold}>
                          Leave Group
                        </Text>
                      </Pressable>
                    ) : (
                      <></>
                    )}
                  </View>
                );
              })
            ) : (
              <></>
            )}
          </ScrollView>
        </AnimatedContainer>
      </Modal>

      <AnimatedContainer>
        <View style={{ borderRadius: 16, overflow: "hidden" }}>
          <CustomMap />
        </View>
      </AnimatedContainer>
    </View>
  );
}

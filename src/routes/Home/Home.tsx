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
} from "../../interfaces/Interfaces";
import { useNavigation } from "@react-navigation/native";
import {
  GetStudentStatus,
  GetStudentStatusList,
  GetStudentStatusListFiltered,
  PatchStudentStatus,
  urlProvider,
} from "../../components/Api/Api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "react-native-toast-notifications";
import React from "react";
import ParseStudyGroupList from "../../components/ParseStudyGroupList/ParseStudyGroupList";
import ParseStudentStatusList from "../../components/ParseStudentStatusList/ParseStudentStatusList";
import CustomMapCallout from "../../components/CustomMapCallout/CustomMapCallout";
import MapRendererFar from "../../components/MapRenderer/MapRendererFar";
import GetDistanceFromUSTP from "../../components/GetDistance/GetDistanceFromUSTP";

export default function Home() {
  // Switch this condition to see the main map when debugging
  const map_debug = false;
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
          GetDistanceRoundedOff(newLocation);
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

  async function GetDistanceRoundedOff(location: RawLocationType) {
    let dist = GetDistanceFromUSTP(location.coords);
    setDist(Math.round(dist));
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
  const StudentStatus = useQuery({
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

  const [student_statuses, setStudentStatuses] = useState<
    StudentStatusFilterTypeFlattened[]
  >([]);
  const [study_groups, setStudyGroups] = useState<subjectUserMapType[]>([]);
  // Student Status List
  const StudentStatusList = useQuery({
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
        setStudyGroups(
          ParseStudyGroupList(data[1], {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          })
        );
        setStudentStatuses(ParseStudentStatusList(data[1]));
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
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.4,
                longitudeDelta: 0.4,
              }}
              loadingBackgroundColor={colors.secondary_2}
            >
              {student_statuses.map(
                (
                  student_status: StudentStatusFilterTypeFlattened,
                  index: number
                ) => {
                  const randomColorWithOpacity = `rgba(${Math.floor(
                    Math.random() * 256
                  )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
                    Math.random() * 256
                  )}, 0.7)`;

                  return (
                    <Marker
                      key={index}
                      coordinate={student_status}
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
              {study_groups.map(
                (student_status: subjectUserMapType, index: number) => {
                  const randomColorWithOpacity = `rgba(${Math.floor(
                    Math.random() * 256
                  )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
                    Math.random() * 256
                  )}, 0.7)`;

                  return (
                    <React.Fragment key={index}>
                      <Marker
                        coordinate={student_status}
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
                                Subject: {student_status.subject}
                              </Text>
                              <Text style={styles.text_white_tiny_bold}>
                                Students Studying: {student_status.users.length}
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
                        center={student_status}
                        radius={student_status.radius}
                        fillColor={randomColorWithOpacity}
                        strokeColor="white"
                        zIndex={1000}
                      />
                    </React.Fragment>
                  );
                }
              )}
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                draggable
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
              >
                <CustomMapCallout
                  location={location}
                  studying={studying}
                  subject={subject}
                />
              </Marker>
            </MapView>
            <Button
              onPress={async () => {
                if (!studying) {
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

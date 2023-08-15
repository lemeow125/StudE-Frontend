import styles, { Viewport, colors } from "../../styles";
import { View, Text } from "react-native";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import { useState, useEffect } from "react";
import MapView, { Callout, Marker, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import GetDistance from "../../components/GetDistance/GetDistance";
import Button from "../../components/Button/Button";
import {
  RootDrawerParamList,
  StudentStatusReturnType,
  LocationType,
  StudentStatusType,
  StudentStatusListReturnType,
} from "../../interfaces/Interfaces";
import { useNavigation } from "@react-navigation/native";
import {
  GetStudentStatus,
  GetStudentStatusList,
  PatchStudentStatus,
  urlProvider,
} from "../../components/Api/Api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "react-native-toast-notifications";
import CustomMapCallout from "../../components/CustomMapCallout/CustomMapCallout";

export default function Home() {
  // Switch this condition to see the main map when debugging
  const map_debug = true;
  const navigation = useNavigation<RootDrawerParamList>();
  const [location, setLocation] = useState<LocationType | null>(null);
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

  async function GetDistanceRoundedOff(location: LocationType) {
    let dist = GetDistance(
      location.coords.latitude,
      location.coords.longitude,
      ustpCoords.latitude,
      ustpCoords.longitude
    );
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
    mutationFn: async (info: StudentStatusType) => {
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

  // Student Status List
  const StudentStatusList = useQuery({
    queryKey: ["user_status_list"],
    queryFn: async () => {
      const data = await GetStudentStatusList();
      if (data[0] == false) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data: StudentStatusListReturnType) => {
      console.log("List of students:", data[1]);
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
              mapType="none"
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
              <UrlTile
                urlTemplate={urlProvider}
                shouldReplaceMapContent={true}
                maximumZ={19}
                flipY={false}
                zIndex={1}
              />
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
        return (
          <View>
            <Text style={styles.text_white_medium}>
              You are too far from USTP {"\n"}
              Get closer to use Stud-E
            </Text>
            <MapView
              style={{
                height: Viewport.height * 0.5,
                width: Viewport.width * 0.8,
                alignSelf: "center",
              }}
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
              mapType="none"
              scrollEnabled={false}
              zoomEnabled={false}
              toolbarEnabled={false}
              rotateEnabled={false}
              minZoomLevel={18}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
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
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                pinColor={colors.primary_1}
              >
                <Callout>
                  <Text style={styles.text_black_tiny}>
                    You are here {"\n"}
                    X: {Math.round(location.coords.longitude) + "\n"}
                    Z: {Math.round(location.coords.latitude)}
                  </Text>
                </Callout>
              </Marker>
            </MapView>
            <Text style={styles.text_white_small}>
              {dist}km away from USTP {"\n"}
            </Text>
          </View>
        );
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

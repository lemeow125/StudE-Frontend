import styles, { Viewport, colors } from "../../styles";
import { View, Text } from "react-native";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import { useState, useEffect } from "react";
import MapView, { Callout, Marker, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import GetDistance from "../../components/GetDistance/GetDistance";
import Button from "../../components/Button/Button";
import { PostStudentStatus } from "../../components/Api/Api";
import { StudentStatusParams } from "../../interfaces/Interfaces";
type LocationType = Location.LocationObject;
export default function Home() {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [dist, setDist] = useState<number | null>(null);
  const [feedback, setFeedback] = useState(
    "To continue, please allow Stud-E permission to location services"
  );
  const urlProvider =
    "https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=0f5cb5930d7642a8a921daea650754d9";
  const ustpCoords = {
    latitude: 8.4857,
    longitude: 124.6565,
    latitudeDelta: 0.000235,
    longitudeDelta: 0.000067,
  };
  async function requestLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setFeedback(
        "Permission to access location was denied. Please allow permission"
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
  }

  function CustomMap() {
    if (dist && location) {
      if (dist >= 2) {
        // Just switch this condition for map debugging
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
                onPress={() => console.log(location)}
                draggable
                onDragEnd={(e) => {
                  const newLocation = e.nativeEvent.coordinate;
                  const distance = GetDistance(
                    newLocation.latitude,
                    newLocation.longitude,
                    location.coords.latitude,
                    location.coords.longitude
                  );
                  console.log("Distance:", distance);
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
                <Callout>
                  <Text style={styles.text_black_medium}>
                    You are here {"\n"}
                    X: {Math.round(location.coords.longitude) + "\n"}
                    Z: {Math.round(location.coords.latitude)}
                  </Text>
                </Callout>
              </Marker>
            </MapView>
            <Button
              onPress={async () => {
                const postData: StudentStatusParams = {
                  subject: "System Administration and Maintenance",
                  location: {
                    latitude: location.coords.latitude,
                    longtitude: location.coords.longitude,
                  },
                };
                await PostStudentStatus(postData);
                console.log(postData);
              }}
            >
              <Text style={styles.text_white_medium}>Start Studying</Text>
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
                onPress={() => console.log(location)}
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
      return (
        <AnimatedContainer>
          <Text style={styles.text_white_medium}>{feedback}</Text>
          <Button onPress={() => requestLocation()}>
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

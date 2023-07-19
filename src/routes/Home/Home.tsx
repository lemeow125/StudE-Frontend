import styles, { Viewport } from "../../styles";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../features/redux/Store/Store";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import { useState, useEffect } from "react";
import MapView, { Marker, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import GetDistance from "../../components/GetDistance/GetDistance";
import Button from "../../components/Button/Button";
import { colors } from "../../styles";

type LocationType = Location.LocationObject;
export default function Home() {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [dist, setDist] = useState<number | null>(null);
  const [feedback, setFeedback] = useState(
    "To continue, please allow Stud-E permission to location services"
  );
  const ustpCoords = {
    latitude: 8.4857,
    longitude: 124.6565,
    latitudeDelta: 0.000235,
    longitudeDelta: 0.000067,
  };

  async function requestLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setFeedback(
        "Permission to access location was denied. Please allow permission"
      );
      return;
    }
    if (status == "granted") {
      let location = await Location.getCurrentPositionAsync({});
      if (location) {
        setLocation(location);
        getDistance(location);
      }
    }
  }
  useEffect(() => {
    requestLocation();
  }, [location]);

  async function getDistance(location: LocationType) {
    let dist = GetDistance(
      location.coords.latitude,
      location.coords.longitude,
      8.4857, // LatitudeDelta
      124.6565 // LongitudeDelta
    );
    setDist(Math.round(dist));
  }

  function CustomMap() {
    if (dist && location) {
      if (dist <= 1.5) {
        // Just switch this condition for map debugging
        return (
          <MapView
            style={styles.map}
            initialRegion={ustpCoords}
            showsUserLocation={true}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            followsUserLocation={true}
            minZoomLevel={15}
          />
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
              showsUserLocation={true}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              followsUserLocation={true}
              minZoomLevel={15}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
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

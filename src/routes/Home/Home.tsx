import styles from "../../styles";
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

  async function requestLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return;
    } else {
      getLocation();
    }
  }

  async function getLocation() {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    let dist = GetDistance(
      location.coords.latitude,
      location.coords.longitude,
      8.4857,
      124.6565
    );
    setDist(Math.round(dist));
  }
  useEffect(() => {
    requestLocation();
  }, []);
  const ustpCoords = {
    latitude: 8.4857,
    longitude: 124.6565,
    latitudeDelta: 0.000235,
    longitudeDelta: 0.000067,
  };
  function CustomMap() {
    if (dist !== null && location !== null) {
      if (dist <= 1) {
        // Just switch this condition for map debugging
        return <MapView style={styles.map} initialRegion={ustpCoords} />;
      } else {
        return (
          <View>
            <Text style={styles.text_white_medium}>
              You must be within 1km of USTP to use Stud-E{"\n"}
            </Text>
            <Text style={styles.text_white_small}>
              {dist}km away from USTP {"\n"}
              User Location:
              {"\n"} Latitude {location.coords.latitude}
              {"\n"} Longitude {location.coords.longitude}
            </Text>
          </View>
        );
      }
    } else {
      return (
        <View>
          <Text style={styles.text_white_medium}>
            Please allow location permission{"\n"}
          </Text>
          <Button onPress={() => requestLocation()} color={colors.blue_3}>
            <Text style={styles.text_white_small}>Register</Text>
          </Button>
        </View>
      );
    }
  }
  const creds = useSelector((state: RootState) => state.user.user);
  return (
    <View style={styles.background}>
      <AnimatedContainer>
        <CustomMap />
      </AnimatedContainer>
    </View>
  );
}

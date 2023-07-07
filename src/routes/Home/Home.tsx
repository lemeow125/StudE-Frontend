import styles from "../../styles";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../features/redux/Store/Store";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import React, { useState, useEffect } from "react";
import MapView, { Marker, UrlTile } from "react-native-maps";
import * as Location from "expo-location";

type LocationType = Location.LocationObject;
export default function Home() {
  const [location, setLocation] = useState<LocationType | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  function getInitialState() {
    return {
      latitude: 8.4857,
      longitude: 124.6565,
      latitudeDelta: 0.000235,
      longitudeDelta: 0.000067,
    };
  }
  const creds = useSelector((state: RootState) => state.user.user);
  return (
    <View style={styles.background}>
      <AnimatedContainer>
        <Text style={styles.text_white_large}>Template Homepage</Text>
        <MapView style={styles.map} initialRegion={getInitialState()}></MapView>
        <Text style={styles.text_white_medium}>
          User Location:{" "}
          {location
            ? `${location.coords.latitude}, ${location.coords.longitude}`
            : "Loading..."}
        </Text>
      </AnimatedContainer>
    </View>
  );
}

import styles, { Viewport } from "../../styles";
import { View, Text } from "react-native";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import { useState, useEffect } from "react";
import MapView, { UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import GetDistance from "../../components/GetDistance/GetDistance";
import Button from "../../components/Button/Button";
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
      let location = await Location.getCurrentPositionAsync({});
      if (location) {
        setLocation(location);
        getDistance(location);
      }
    }
  }

  // Refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      requestLocation();
    }, 10000);

    return () => clearInterval(interval);
  });

  // Run when screen loads
  useEffect(() => {
    requestLocation();
  }, []);

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
            mapType="none"
            initialRegion={ustpCoords}
            showsUserLocation={true}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            followsUserLocation={true}
            minZoomLevel={15}
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
          >
            <UrlTile
              urlTemplate={urlProvider}
              shouldReplaceMapContent={true}
              tileCachePath=""
              maximumZ={19}
              flipY={false}
              zIndex={1}
            />
          </MapView>
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
            >
              <UrlTile
                urlTemplate={urlProvider}
                shouldReplaceMapContent={true}
                maximumZ={19}
                flipY={false}
                zIndex={1}
              />
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

import * as React from "react";
import { View, Text } from "react-native";
import MapView, { UrlTile, Callout, Marker } from "react-native-maps";
import styles, { Viewport, colors } from "../../styles";
import { urlProvider } from "../Api/Api";
import { LocationType, RawLocationType } from "../../interfaces/Interfaces";
import GetDistance from "../../components/GetDistance/GetDistance";

type props = {
  location: LocationType;
  dist: any;
};

export default function MapRendererFar(props: props) {
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
          latitude: props.location.latitude,
          longitude: props.location.longitude,
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
            latitude: props.location.latitude,
            longitude: props.location.longitude,
          }}
          pinColor={colors.primary_1}
        >
          <Callout>
            <Text style={styles.text_black_tiny}>
              You are here {"\n"}
              X: {Math.round(props.location.longitude) + "\n"}
              Z: {Math.round(props.location.latitude)}
            </Text>
          </Callout>
        </Marker>
      </MapView>
      <Text style={styles.text_white_small}>
        {props.dist}km away from USTP {"\n"}
      </Text>
    </View>
  );
}

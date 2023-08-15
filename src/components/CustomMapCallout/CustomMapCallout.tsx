import { Callout } from "react-native-maps";
import { LocationType } from "../../interfaces/Interfaces";
import styles from "../../styles";
import { Text } from "react-native";

// Map popup for user's location

type props = {
  location: LocationType;
  studying: boolean;
  subject?: string;
};

export default function CustomMapCallout(props: props) {
  let { location, studying, subject } = props;
  if (location && location.coords) {
    if (studying) {
      return (
        <Callout>
          <Text style={styles.text_black_tiny}>
            You are here {"\n"}
            X: {Math.round(location.coords.longitude) + "\n"}
            Z: {Math.round(location.coords.latitude) + "\n"}
            Studying: {subject}
          </Text>
        </Callout>
      );
    } else {
      return (
        <Callout>
          <Text style={styles.text_black_tiny}>
            You are here {"\n"}
            X: {Math.round(location.coords.longitude) + "\n"}
            Z: {Math.round(location.coords.latitude)}
          </Text>
        </Callout>
      );
    }
  }
  return <></>;
}

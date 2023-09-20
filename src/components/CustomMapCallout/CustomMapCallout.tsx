import { Callout } from "react-native-maps";
import { LocationType, RawLocationType } from "../../interfaces/Interfaces";
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
  if (location && location.latitude && location.longitude) {
    if (studying) {
      return (
        <Callout>
          <Text style={styles.text_black_tiny}>
            You are here {"\n"}
            X: {Math.round(location.longitude) + "\n"}
            Z: {Math.round(location.latitude) + "\n"}
            Studying: {subject}
          </Text>
        </Callout>
      );
    } else {
      return (
        <Callout>
          <Text style={styles.text_black_tiny}>
            You are here {"\n"}
            X: {Math.round(location.longitude) + "\n"}
            Z: {Math.round(location.latitude)}
          </Text>
        </Callout>
      );
    }
  }
  return <></>;
}

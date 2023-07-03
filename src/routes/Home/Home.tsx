import * as React from "react";
import styles from "../../styles";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../features/redux/Store/Store";

export default function Home() {
  const creds = useSelector((state: RootState) => state.auth.creds);
  return (
    <View style={styles.background}>
      <Text style={styles.text_white_large}>Template Homepage</Text>
      <Text style={styles.text_white_tiny}>{JSON.stringify(creds)}</Text>
      <Text style={styles.text_white_tiny}>Token: {creds.token}</Text>
    </View>
  );
}

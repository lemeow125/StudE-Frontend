import * as React from "react";
import styles from "../../styles";
import { font_sizes } from "../../styles";
import { View, Text } from "react-native";

export default function Home() {
  return (
    <View style={styles.background}>
      <Text
        style={{
          fontSize: font_sizes.large,
          color: "white",
          textAlign: "center",
        }}
      >
        Template Homepage
      </Text>
    </View>
  );
}

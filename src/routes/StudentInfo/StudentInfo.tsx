import * as React from "react";
import { View, Text } from "react-native";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import styles from "../../styles";

export default function StudentInfo() {
  return (
    <View style={styles.background}>
      <AnimatedContainer>
        <Text>StudentInfo</Text>
      </AnimatedContainer>
    </View>
  );
}

import * as React from "react";
import styles from "../../styles";
import { View, Text, ActivityIndicator } from "react-native";
import { colors } from "../../styles";
import AnimatedContainer from "../AnimatedContainer/AnimatedContainer";

export default function LoadingFeedback() {
  return (
    <View style={styles.background}>
      <AnimatedContainer>
        <View style={{ paddingVertical: 8 }} />
        <ActivityIndicator size={128} color={colors.secondary_1} />
        <Text style={styles.text_white_medium}>Loading...</Text>
      </AnimatedContainer>
    </View>
  );
}

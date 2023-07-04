import * as React from "react";
import styles, { colors } from "../../styles";
import { View, Text, ActivityIndicator } from "react-native";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import { useRoute } from "@react-navigation/native";

interface ActivationRouteParams {
  uid?: string;
  token?: string;
}

export default function Activation() {
  const route = useRoute();
  const { uid, token } = route.params as ActivationRouteParams;
  return (
    <View style={styles.background}>
      <AnimatedContainer>
        <Text style={styles.text_white_large}>Activation</Text>
        <View style={{ paddingVertical: 8 }} />
        <ActivityIndicator size={96} color={colors.blue_1} />
        <Text style={styles.text_white_medium}>
          Activating {uid ? `with UID: ${uid}` : ""}{" "}
          {token ? `and Token: ${token}` : ""}
        </Text>
      </AnimatedContainer>
    </View>
  );
}

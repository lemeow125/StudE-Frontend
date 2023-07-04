import * as React from "react";
import styles, { colors } from "../../styles";
import { View, Text, ActivityIndicator } from "react-native";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { UserActivate } from "../../components/Api/Api";

interface ActivationRouteParams {
  uid?: string;
  token?: string;
}

export default function Activation() {
  const route = useRoute();
  const { uid, token } = (route.params as ActivationRouteParams) || "";

  const [state, setState] = useState(
    "Activating with UID " + uid + " and Token " + token
  );
  const [loading, setLoading] = useState(true);
  async function activate() {
    if (await UserActivate({ uid: String(uid), token: String(token) })) {
      setTimeout(() => {
        setState("Activation successful!");
      }, 1000);
    } else {
      setTimeout(() => {
        setState("Activation unsuccessful\nPlease contact support");
      }, 1000);
    }
    setLoading(false);
  }
  useEffect(() => {
    activate();
  }, []);
  return (
    <View style={styles.background}>
      <AnimatedContainer>
        <View
          style={{
            paddingVertical: 4,
            marginBottom: 16,
            borderRadius: 4,
            width: "90%",
            backgroundColor: colors.blue_1,
          }}
        />
        <Text style={styles.text_white_large}>Activation</Text>
        <View style={{ paddingVertical: 8 }} />
        <ActivityIndicator
          animating={loading}
          size={96}
          color={colors.blue_1}
        />
        <Text style={styles.text_white_medium}>{state}</Text>
      </AnimatedContainer>
    </View>
  );
}

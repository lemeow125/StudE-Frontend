import * as React from "react";
import styles, { colors } from "../../styles";
import { View, Text, ActivityIndicator } from "react-native";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { UserActivate } from "../../components/Api/Api";
import { RootDrawerParamList } from "../../interfaces/Interfaces";

interface ActivationRouteParams {
  uid?: string;
  token?: string;
}

export default function Activation() {
  const route = useRoute();
  const { uid, token } = (route.params as ActivationRouteParams) || "";
  const navigation = useNavigation<RootDrawerParamList>();
  const [state, setState] = useState(
    "Activating with UID " + uid + " and Token " + token
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function activate() {
      let result = await UserActivate({
        uid: String(uid),
        token: String(token),
      });
      if (result) {
        setTimeout(() => {
          setState("Activation successful!");
        }, 1000);
        setTimeout(() => {
          navigation.navigate("Login");
        }, 2000);
      } else {
        setTimeout(() => {
          setState("Activation unsuccessful\nPlease contact support");
        }, 1000);
      }
      setLoading(false);
    }
    activate();
  }, [uid, token]);

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
        <Text style={styles.text_white_tiny}>{uid + "\n" + token}</Text>
      </AnimatedContainer>
    </View>
  );
}

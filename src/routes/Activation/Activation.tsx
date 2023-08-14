import * as React from "react";
import styles, { colors } from "../../styles";
import { View, Text, ActivityIndicator } from "react-native";
import AnimatedContainer from "../../components/AnimatedContainer/AnimatedContainer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { UserActivate } from "../../components/Api/Api";
import { RootDrawerParamList } from "../../interfaces/Interfaces";
import { useToast } from "react-native-toast-notifications";

interface ActivationRouteParams {
  uid?: string;
  token?: string;
}

export default function Activation() {
  const route = useRoute();
  const { uid, token } = (route.params as ActivationRouteParams) || "";
  const navigation = useNavigation<RootDrawerParamList>();
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function activate() {
      let result = await UserActivate({
        uid: String(uid),
        token: String(token),
      });
      if (result) {
        toast.show("Activation successful", {
          type: "success",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
        setTimeout(() => {
          navigation.navigate("Login");
        }, 2000);
      } else {
        toast.show("Activation unsuccessful. Please contact support", {
          type: "warning",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
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
            backgroundColor: colors.secondary_1,
          }}
        />
        <Text style={styles.text_white_large}>Activation</Text>
        <View style={{ paddingVertical: 8 }} />
        <ActivityIndicator
          animating={loading}
          size={96}
          color={colors.secondary_1}
        />
        <Text style={styles.text_white_medium}>
          {"Activating with UID: " + uid + "\nToken: " + token}
        </Text>
      </AnimatedContainer>
    </View>
  );
}

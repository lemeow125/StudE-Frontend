import * as React from "react";
import styles from "../../styles";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootDrawerParamList } from "../../interfaces/Interfaces";
export default function Onboarding() {
  const navigation = useNavigation<RootDrawerParamList>();
  // const dispatch = useDispatch();
  // const creds = useSelector((state: RootState) => state.auth.creds);
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.text_white_medium}>Template Onboarding Page</Text>
      </View>
    </View>
  );
}

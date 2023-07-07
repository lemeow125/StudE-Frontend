import * as React from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "../../styles";
import { colors } from "../../styles";
import { MotiView, MotiScrollView } from "moti";
export interface props {
  children: React.ReactNode;
}

export default function AnimatedContainer(props: props) {
  return (
    <View style={styles.container}>
      <MotiScrollView
        from={{
          opacity: 0,
          backgroundColor: colors.orange_1,
          flex: 1,
        }}
        animate={{
          opacity: 1,
          backgroundColor: colors.blue_2,
          flex: 1,
        }}
        transition={{ type: "timing", duration: 300 }}
      >
        {props.children}
      </MotiScrollView>
    </View>
  );
}

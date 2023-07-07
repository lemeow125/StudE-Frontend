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
    <MotiView
      style={styles.container}
      from={{ opacity: 0, backgroundColor: colors.orange_1 }}
      animate={{ opacity: 1, backgroundColor: colors.blue_2 }}
      transition={{ type: "timing", duration: 300 }}
    >
      {props.children}
    </MotiView>
  );
}

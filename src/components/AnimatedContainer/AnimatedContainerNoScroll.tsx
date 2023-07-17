import * as React from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "../../styles";
import { colors } from "../../styles";
import { MotiView, MotiScrollView } from "moti";
export interface props {
  children: React.ReactNode;
}

export default function AnimatedContainerNoScroll(props: props) {
  return (
    <MotiView
      style={styles.container}
      from={{
        borderRadius: 0,
        opacity: 0,
        backgroundColor: colors.secondary_2,
        paddingTop: 4,
        paddingBottom: 4,
        marginHorizontal: "4%",
        marginVertical: "10%",
      }}
      animate={{
        borderRadius: 15,
        opacity: 1,
        backgroundColor: colors.secondary_2,
        paddingTop: 16,
        paddingBottom: 16,
        marginHorizontal: "4%",
        marginVertical: "5%",
      }}
      transition={{ type: "timing", duration: 700 }}
    >
      {props.children}
    </MotiView>
  );
}

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
    <MotiScrollView
      contentContainerStyle={styles.container}
      from={{
        borderRadius: 0,
        backgroundColor: colors.primary_3,
        paddingTop: 4,
        paddingBottom: 4,
        marginHorizontal: "4%",
        marginVertical: "10%",
      }}
      animate={{
        borderRadius: 15,
        backgroundColor: colors.primary_3,
        paddingTop: 16,
        paddingBottom: 16,
        marginHorizontal: "4%",
        marginVertical: "5%",
      }}
      transition={{ type: "timing", duration: 300 }}
    >
      {props.children}
    </MotiScrollView>
  );
}

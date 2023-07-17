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
        backgroundColor: colors.orange_2,
        paddingTop: 4,
        paddingBottom: 4,
        marginHorizontal: "4%",
        marginVertical: "5%",
      }}
      animate={{
        borderRadius: 15,
        backgroundColor: colors.blue_2,
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

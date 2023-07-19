import * as React from "react";
import { Pressable } from "react-native";
import styles from "../../styles";
import { colors } from "../../styles";

export default function DrawerButton({ color = colors.secondary_3, ...props }) {
  return (
    <Pressable
      onPress={props.onPress}
      style={{
        ...styles.button_template,
        ...{
          backgroundColor: color,
          width: "95%",
          justifyContent: "flex-start",
        },
      }}
    >
      {props.children}
    </Pressable>
  );
}

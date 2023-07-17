import * as React from "react";
import { Pressable, GestureResponderEvent } from "react-native";
import styles from "../../styles";

export interface props {
  children: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  color?: string;
  disabled?: boolean;
}

export default function Button({
  disabled = false,
  color = "rgba(52, 52, 52, 0.8)",
  ...props
}: props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={props.onPress}
      style={styles.button_template}
    >
      {props.children}
    </Pressable>
  );
}

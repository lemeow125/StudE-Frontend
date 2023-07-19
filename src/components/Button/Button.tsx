import * as React from "react";
import { Pressable, GestureResponderEvent } from "react-native";
import styles from "../../styles";
import { colors } from "../../styles";
export interface props {
  children: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  color?: string;
  disabled?: boolean;
}

export default function Button({ disabled = false, ...props }: props) {
  if (!props.color) {
    props.color = colors.secondary_3;
  }
  return (
    <Pressable
      disabled={disabled}
      onPress={props.onPress}
      style={{ ...styles.button_template, ...{ backgroundColor: props.color } }}
    >
      {props.children}
    </Pressable>
  );
}

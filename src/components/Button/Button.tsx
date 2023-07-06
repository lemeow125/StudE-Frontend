import * as React from "react";
import { Pressable, GestureResponderEvent } from "react-native";
import styles from "../../styles";

export interface props {
  children: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  color: string;
  disabled?: boolean;
}

export default function Button({ disabled = false, ...props }: props) {
  const rgb = props.color.match(/\d+/g);
  return (
    <Pressable
      disabled={disabled}
      onPress={props.onPress}
      style={{
        ...styles.button_template,
        ...{
          backgroundColor: disabled
            ? rgb
              ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.3)`
              : "rgba(0, 0, 0, 0)"
            : props.color,
          width: "50%",
        },
      }}
    >
      {props.children}
    </Pressable>
  );
}

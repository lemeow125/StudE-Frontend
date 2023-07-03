import * as React from "react";
import { Text, Pressable, GestureResponderEvent } from "react-native";
import styles from "../../styles";

export interface props {
  children: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  color: string;
}

export default function DrawerButton(props: props) {
  return (
    <Pressable
      onPress={props.onPress}
      style={{
        ...styles.button_template,
        ...{ backgroundColor: props.color, width: "95%" },
      }}
    >
      {props.children}
    </Pressable>
  );
}

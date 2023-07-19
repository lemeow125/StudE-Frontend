import * as React from "react";
import { IconProps } from "../../interfaces/Interfaces";
import { Image } from "react-native";
export default function AppIcon(props: IconProps) {
  return (
    <>
      <Image
        style={{ height: props.size, width: props.size, marginHorizontal: -16 }}
        source={require("../../img/app_icon_light.png")}
      />
    </>
  );
}

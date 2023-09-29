import * as React from "react";
import { IconProps } from "../../interfaces/Interfaces";
import { Svg, Path } from "react-native-svg";
import { colors } from "../../styles";

export default function CaretUpIcon(props: IconProps) {
  return (
    <>
      <Svg
        height={props.size + "px"}
        width={props.size + "px"}
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke={colors.icon_color}
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <Path stroke="none" d="M0 0h24v24H0z" fill="none"></Path>
        <Path d="M18 14l-6 -6l-6 6h12"></Path>
      </Svg>
    </>
  );
}

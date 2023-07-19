import * as React from "react";
import { IconProps } from "../../interfaces/Interfaces";
import { Svg, Path } from "react-native-svg";
import { colors } from "../../styles";

export default function DropdownIcon(props: IconProps) {
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
        <Path d="M6 10l6 6l6 -6h-12"></Path>
      </Svg>
    </>
  );
}

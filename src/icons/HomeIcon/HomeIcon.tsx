import * as React from "react";
import { IconProps } from "../../interfaces/Interfaces";

import { Svg, Path } from "react-native-svg";
import { colors } from "../../styles";

export default function HomeIcon(props: IconProps) {
  return (
    <>
      <Svg
        width={props.size}
        height={props.size}
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke={colors.icon_color}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path stroke="none" d="M0 0h24v24H0z" fill="none"></Path>
        <Path d="M5 12l-2 0l9 -9l9 9l-2 0"></Path>
        <Path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></Path>
        <Path d="M10 12h4v4h-4z"></Path>
      </Svg>
    </>
  );
}

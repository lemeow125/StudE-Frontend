import * as React from "react";
import { IconProps } from "../../interfaces/Interfaces";

import { Svg, Path } from "react-native-svg";
import { colors } from "../../styles";

export default function RefreshIcon(props: IconProps) {
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
        <Path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></Path>
        <Path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></Path>
      </Svg>
    </>
  );
}

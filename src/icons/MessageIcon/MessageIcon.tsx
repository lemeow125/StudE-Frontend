import * as React from "react";
import { IconProps } from "../../interfaces/Interfaces";

import { Svg, Path } from "react-native-svg";
import { colors } from "../../styles";

export default function MessageIcon(props: IconProps) {
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
        <Path d="M8 9h8"></Path>
        <Path d="M8 13h6"></Path>
        <Path d="M12.5 20.5l-.5 .5l-3 -3h-3a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4"></Path>
        <Path d="M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879z"></Path>
        <Path d="M19 18v.01"></Path>
      </Svg>
    </>
  );
}

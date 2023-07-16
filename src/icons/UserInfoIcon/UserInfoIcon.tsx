import * as React from "react";
import { IconProps } from "../../interfaces/Interfaces";

import { Svg, Path } from "react-native-svg";
import { colors } from "../../styles";
import finalPropsSelectorFactory from "react-redux/es/connect/selectorFactory";

export default function UserInfoIcon(props: IconProps) {
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
        <Path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></Path>
        <Path d="M6 21v-2a4 4 0 0 1 4 -4h2.5"></Path>
        <Path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></Path>
        <Path d="M19.001 15.5v1.5"></Path>
        <Path d="M19.001 21v1.5"></Path>
        <Path d="M22.032 17.25l-1.299 .75"></Path>
        <Path d="M17.27 20l-1.3 .75"></Path>
        <Path d="M15.97 17.25l1.3 .75"></Path>
        <Path d="M20.733 20l1.3 .75"></Path>
      </Svg>
    </>
  );
}

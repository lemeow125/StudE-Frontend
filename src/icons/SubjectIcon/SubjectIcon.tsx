import * as React from "react";
import { IconProps } from "../../interfaces/Interfaces";

import { Svg, Path } from "react-native-svg";
import { colors } from "../../styles";

export default function SubjectIcon(props: IconProps) {
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
        <Path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z"></Path>
        <Path d="M19 16h-12a2 2 0 0 0 -2 2"></Path>
        <Path d="M9 8h6"></Path>
      </Svg>
    </>
  );
}

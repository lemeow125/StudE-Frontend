import * as React from "react";
import { IconProps } from "../../interfaces/Interfaces";

import { Svg, Path } from "react-native-svg";
import { colors } from "../../styles";

export default function AddIcon(props: IconProps) {
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
        <Path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></Path>
        <Path d="M9 12l6 0"></Path>
        <Path d="M12 9l0 6"></Path>
      </Svg>
    </>
  );
}

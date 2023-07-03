import { StyleSheet } from "react-native";

export const colors = {
  orange_1: "#FFBC72",
  orange_2: "#FFE2C1",
  orange_3: "#C07624",
  blue_1: "#4C87A1",
  blue_2: "#77ACC3",
  blue_3: "#1B5D79",
  text_default: "white",
  icon_color: "white",
};

export const font_sizes = {
  tiny: 12,
  small: 16,
  medium: 24,
  large: 36,
  xl: 48,
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.orange_1,
    height: "100%",
    width: "100%",
  },
  flex_row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  flex_column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  text_white_tiny: {
    color: colors.text_default,
    fontSize: font_sizes.tiny,
    fontWeight: "bold",
    textAlign: "center",
  },
  text_white_small: {
    color: colors.text_default,
    fontSize: font_sizes.small,
    fontWeight: "bold",
    textAlign: "center",
  },
  text_white_medium: {
    color: colors.text_default,
    fontSize: font_sizes.medium,
    fontWeight: "bold",
    textAlign: "center",
  },
  text_white_large: {
    color: colors.text_default,
    fontSize: font_sizes.large,
    fontWeight: "bold",
    textAlign: "center",
  },
  text_white_xl: {
    color: colors.text_default,
    fontSize: font_sizes.xl,
    fontWeight: "bold",
    textAlign: "center",
  },
  button_template: {
    justifyContent: "flex-start",
    alignSelf: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    margin: 8,
    padding: 8,
    borderRadius: 16,
  },
});

export default styles;

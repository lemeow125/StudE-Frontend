import { StyleSheet, Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const containerWidth = width - width * 0.08;
const containerHeight = height - height * 0.01;

export const colors = {
  orange_1: "#FFBC72",
  orange_2: "#FFE2C1",
  orange_3: "#C07624",
  blue_1: "#4C87A1",
  blue_2: "#77ACC3",
  blue_3: "#1B5D79",
  text_default: "white",
  text_error: "#e32d1e",
  text_success: "green",
  icon_color: "white",
  blue_disabled: "#C07624",
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
  container: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    paddingHorizontal: 4,
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
    justifyContent: "center",
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
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    marginVertical: 4,
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 16,
  },
  text_input: {
    color: colors.text_default,
    backgroundColor: colors.blue_1,
    width: "50%",
    padding: 10,
    borderRadius: 8,
  },
  dropdown_template: {
    borderRadius: 16,
    width: "70%",
    marginVertical: 6,
  },
  map: {
    flex: 1,
    height: containerHeight,
    width: containerWidth,
    alignSelf: "center",
  },
});

export default styles;

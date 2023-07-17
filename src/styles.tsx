import { StyleSheet, Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const containerWidth = width - width * 0.08;
const containerHeight = height - height * 0.01;

export const colors = {
  orange_1: "#FFDEAD",
  orange_2: "#FFE2C1",
  orange_3: "#C07624",
  blue_1: "#E3963E",
  blue_2: "#FFAC1C",
  blue_3: "#FFAC1C",
  text_default: "white",
  text_error: "#e32d1e",
  text_success: "green",
  icon_color: "white",
  login_color: "#0047AB",
  reg_color: "#0096FF",
  head: "white",
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
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    marginVertical: 4,
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 16,
    width: width * 0.4,
  },
  text_input: {
    color: colors.text_default,
    backgroundColor: colors.blue_1,
    padding: 10,
    borderRadius: 8,
    width: width * 0.5,
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
  profile: {
    height: 96,
    width: 96,
    alignSelf: "center",
    borderRadius: 150 / 2,
    overflow: "hidden",
  },
  input: {
    height: 40,
    margin: 12,
    marginRight: 30,
    borderWidth: 1,
    color: colors.text_default,
    backgroundColor: colors.blue_1,
    borderRadius: 8,
    borderColor: "#FFAC1C",
    padding: 8,
  },
  text: {
    marginLeft: 5,
    color: colors.text_default,
    fontSize: font_sizes.small,
    fontWeight: "bold",
  },
  padding: {
    paddingVertical: 8,
  },
});
export default styles;

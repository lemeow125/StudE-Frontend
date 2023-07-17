import { StyleSheet, Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const containerWidth = width - width * 0.08;
const containerHeight = height - height * 0.01;

export const colors = {
  primary_1: "#FFDEAD",
  primary_2: "#FFE2C1",
  primary_3: "#fdac1d",
  primary_4: "#e3973f",
  secondary_1: "#4C87A1",
  secondary_2: "#77ACC3",
  secondary_3: "#1B5D79",
  secondary_4: "#0047AB",
  text_default: "#FFFF",
  text_error: "#e32d1e",
  text_success: "#2ecc71",
  icon_color: "#FFFF",
  button_1: "#0047AB",
  button_2: "#0096FF",
  head: "#FFFF",
};

export const font_sizes = {
  tiny: 12,
  small: 16,
  medium: 24,
  medium_large: 30,
  large: 36,
  xl: 48,
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.primary_1,
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
  text_white_medium_large: {
    color: colors.text_default,
    fontSize: font_sizes.medium_large,
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
    backgroundColor: colors.secondary_1,
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
    backgroundColor: colors.primary_4,
    borderRadius: 8,
    borderColor: colors.primary_3,
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

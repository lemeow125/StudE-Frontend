import { StyleSheet } from "react-native";

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
  head: "white"
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
    marginTop: "5%",
    width: "92%",
    borderRadius: 15,
    backgroundColor: colors.blue_2,
    alignItems: "center",
    alignSelf: "center",
    paddingTop: 32,
    paddingBottom: 32,
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "column",
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
});

export default styles;

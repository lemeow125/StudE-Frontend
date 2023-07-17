import type { DrawerNavigationOptions } from "@react-navigation/drawer";
import { View } from "react-native";
import { colors } from "../../styles";
import { font_sizes } from "../../styles";
import AppIcon from "../../icons/AppIcon/AppIcon";

const DrawerScreenSettings: DrawerNavigationOptions = {
  headerTitleStyle: {
    color: colors.text_default,
    fontSize: font_sizes.medium,
  },
  unmountOnBlur: true,
  headerStyle: { backgroundColor: colors.login_color},
  headerTintColor: colors.text_default,
  drawerType: "slide",
  drawerLabelStyle: {
    color: colors.text_default,
  },
  drawerStyle: {
    backgroundColor: colors.login_color,
    width: 260,
  },
  headerRight: () => (
    <View
      style={{ flexDirection: "row", marginRight: 16, alignItems: "center" }}
    >
      <AppIcon size={32} />
    </View>
  ),
};
export default DrawerScreenSettings;

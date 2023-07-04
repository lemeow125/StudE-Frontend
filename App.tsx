import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Provider } from "react-redux";
import store from "./src/features/redux/Store/Store";
import "react-native-reanimated";
import "react-native-gesture-handler";

import CustomDrawerContent from "./src/components/DrawerSettings/CustomDrawerContent";
import DrawerScreenSettings from "./src/components/DrawerSettings/DrawerScreenSettings";

import Home from "./src/routes/Home/Home";
import Login from "./src/routes/Login/Login";
import Register from "./src/routes/Register/Register";
import Onboarding from "./src/routes/Onboarding/Onboarding";
import Revalidation from "./src/routes/Revalidation/Revalidation";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Revalidation"
          drawerContent={CustomDrawerContent}
          screenOptions={DrawerScreenSettings}
        >
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Login" component={Login} />
          <Drawer.Screen name="Register" component={Register} />
          <Drawer.Screen name="Onboarding" component={Onboarding} />
          <Drawer.Screen name="Revalidation" component={Revalidation} />
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

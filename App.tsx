import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Provider } from "react-redux";
import store from "./src/features/redux/Store/Store";
import "react-native-reanimated";
import "react-native-gesture-handler";
import * as Linking from "expo-linking";

import CustomDrawerContent from "./src/components/DrawerSettings/CustomDrawerContent";
import DrawerScreenSettings from "./src/components/DrawerSettings/DrawerScreenSettings";

import Home from "./src/routes/Home/Home";
import Login from "./src/routes/Login/Login";
import Register from "./src/routes/Register/Register";
import Onboarding from "./src/routes/Onboarding/Onboarding";
import Revalidation from "./src/routes/Revalidation/Revalidation";
import Activation from "./src/routes/Activation/Activation";
import { useState, useEffect } from "react";

const Drawer = createDrawerNavigator();

const linking = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Home: "home",
      Login: "login",
      Register: "register",
      Onboarding: "onboarding",
      Revalidation: "revalidation",
      Activation: "activation/:uid?/:token?",
      NotFound: "*",
    },
  },
};

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  useEffect(() => {
    async function getInitialURL() {
      const url = await Linking.getInitialURL();
      if (url) {
        setInitialRoute(url);
      }
    }
    if (!initialRoute) {
      getInitialURL();
    }
  }, [initialRoute]);

  if (!initialRoute) {
    console.log("heh");
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer linking={linking}>
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
          <Drawer.Screen name="Activation" component={Activation} />
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

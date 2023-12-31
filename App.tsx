import "react-native-gesture-handler";
import styles from "./src/styles";
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
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import UserInfoPage from "./src/routes/UserInfoPage/UserInfoPage";
import SubjectsPage from "./src/routes/SubjectsPage/SubjectsPage";
import ConversationPage from "./src/routes/ConversationPage/ConversationPage";
import Loading from "./src/routes/Loading/Loading";
import StartStudying from "./src/routes/StartStudying/StartStudying";
import { ToastProvider } from "react-native-toast-notifications";
import InfoIcon from "./src/icons/InfoIcon/InfoIcon";
import CreateGroup from "./src/routes/CreateGroup/CreateGroup";
import BackgroundComponent from "./src/components/BackgroundTask/BackgroundTask";

const Drawer = createDrawerNavigator();

const linking = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Home: "",
      Login: "login",
      Register: "register",
      Onboarding: "onboarding",
      Revalidation: "revalidation",
      Activation: "activation/:uid?/:token?",
      NotFound: "*",
    },
  },
};

const queryClient = new QueryClient();

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
  return (
    <ToastProvider
      icon={<InfoIcon size={32} />}
      textStyle={{ ...styles.text_white_tiny_bold }}
    >
      <BackgroundComponent />
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <StatusBar style="light" />

          <NavigationContainer linking={linking} fallback={<Loading />}>
            <Drawer.Navigator
              initialRouteName="Revalidation"
              drawerContent={CustomDrawerContent}
              screenOptions={DrawerScreenSettings}
            >
              <Drawer.Screen name="Login" component={Login} />
              <Drawer.Screen name="Register" component={Register} />
              <Drawer.Screen name="Home" component={Home} />
              <Drawer.Screen name="Onboarding" component={Onboarding} />
              <Drawer.Screen name="Revalidation" component={Revalidation} />
              <Drawer.Screen name="Activation" component={Activation} />
              <Drawer.Screen name="User Info" component={UserInfoPage} />
              <Drawer.Screen name="Subjects" component={SubjectsPage} />
              <Drawer.Screen name="Start Studying" component={StartStudying} />
              <Drawer.Screen name="Create Group" component={CreateGroup} />
              <Drawer.Screen name="Conversation" component={ConversationPage} />
            </Drawer.Navigator>
          </NavigationContainer>
        </Provider>
      </QueryClientProvider>
    </ToastProvider>
  );
}

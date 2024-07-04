import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { PaperProvider } from "react-native-paper";
import BottomNavComponent from "./src/components/BottomNavComponent";
import WalkDetails from "./src/screens/WalkDetails";

const Stack = createStackNavigator();

export default App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="BottomNav">
          <Stack.Screen
            name="BottomNav"
            component={BottomNavComponent}
            // options={{ headerShown: false }}
          />
          <Stack.Screen
            name="WalkDetails"
            component={WalkDetails}
            options={{ title: "Walk Details" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

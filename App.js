import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { PaperProvider } from "react-native-paper";
import BottomNavComponent from "./src/components/BottomNavComponent";
import WalkDetails from "./src/screens/WalkDetails";
import SignIn from "./src/screens/SignIn";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

const Stack = createStackNavigator();

export default App = () => {
  const { user } = useAuth();

  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="BottomNav">
            {user ? (
              <>
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
              </>
            ) : (
              <Stack.Screen name="SignIn" component={SignIn} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
};

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { PaperProvider } from "react-native-paper";
import BottomNavComponent from "./src/components/BottomNavComponent";
import WalkDetails from "./src/screens/WalkDetails";
import SignIn from "./src/screens/SignIn";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";

const Stack = createStackNavigator();

export default App = () => {
  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
};

const MainNavigator = () => {
  const { user, isLoading, isSignout } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator initialRouteName="BottomNav">
      {user == null ? (
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{
            title: 'Sign in',
            animationTypeForReplace: isSignout ? 'pop' : 'push',
          }}
        />
      ) : (
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
      )}
    </Stack.Navigator>
  );
};
import { View, StyleSheet, ActivityIndicator } from "react-native";
import {Text} from "react-native-paper"

export default SplashScreen = () => (
  <View style={styles.container}>
  <Text variant="titleLarge">Welcome</Text>
    <ActivityIndicator size="large" />
    <Text>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

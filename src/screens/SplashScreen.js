import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import {Text} from "react-native-paper"

export default SplashScreen = () => (
  <View style={styles.container}>
  <Text variant="titleLarge">Welcome</Text>
    <ActivityIndicator size="large" style={{marginVertical: 10}} />
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

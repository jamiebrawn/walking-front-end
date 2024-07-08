import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text>Username: {user.username}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </>
      ) : (
        <Text>Please sign in.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

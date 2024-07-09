
import { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import {
  Text,
  Button,
} from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';  

export default SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    setErrorMessage("");
    try {
      await signIn(username, password);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid username or password");
      } else {
        setErrorMessage("Server error, please try again later");
      }
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "username") setUsername(value);
    if (field === "password") setPassword(value);
    setErrorMessage('');
    setIsButtonDisabled(!(username && password));
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Sign In
      </Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={(value) => handleInputChange("username", value)}
        style={styles.input}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(value) => handleInputChange("password", value)}
          secureTextEntry={!passwordVisible}
          style={styles.passwordInput}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.icon}>
          <Icon name={passwordVisible ? "eye-off" : "eye"} size={20} />
        </TouchableOpacity>
      </View>
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      <Button
        mode="contained"
        onPress={handleSignIn}
        disabled={isButtonDisabled}
        style={styles.button}
      >
        Sign In
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  passwordInput: {
    flex: 1,
  },
  icon: {
    padding: 5,
  },
  button: {
    marginTop: 12,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
  },
});

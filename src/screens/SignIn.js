// import { useState } from "react";
// import { View, StyleSheet } from "react-native";
// import {
//   Text,
//   TextInput,
//   IconButton,
//   Button,
//   Snackbar,
// } from "react-native-paper";
// import { useAuth } from "../contexts/AuthContext";

// export default SignIn = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isButtonDisabled, setIsButtonDisabled] = useState(true);
//   const { signIn } = useAuth();

//   const handleSignIn = async () => {
//     setErrorMessage("");
//     try {
//       await signIn(username, password);
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         setErrorMessage("Invalid username or password");
//       } else {
//         setErrorMessage("Server error, please try again later");
//       }
//     }
//   };

//   const handleInputChange = (field, value) => {
//     if (field === "username") setUsername(value);
//     if (field === "password") setPassword(value);
//     setErrorMessage('');
//     setIsButtonDisabled(!(username && password));
//   };

//   return (
//     <View style={styles.container}>
//       <Text variant="titleLarge" style={styles.title}>
//         Sign In
//       </Text>
//       <TextInput
//         label="Username"
//         value={username}
//         onChangeText={(value) => handleInputChange("username", value)}
//         style={styles.input}
//         mode="outlined"
//       />
//       <View style={styles.passwordContainer}>
//         <TextInput
//           label="Password"
//           value={password}
//           onChangeText={(value) => handleInputChange("password", value)}
//           secureTextEntry={!passwordVisible}
//           style={styles.passwordInput}
//           mode="outlined"
//         />
//         <IconButton
//           icon={passwordVisible ? "eye-off" : "eye"}
//           onPress={() => setPasswordVisible(!passwordVisible)}
//           style={styles.iconButton}
//         />
//       </View>
//       {errorMessage ? (
//         <Text style={styles.errorMessage}>{errorMessage}</Text>
//       ) : null}
//       <Button
//         mode="contained"
//         onPress={handleSignIn}
//         disabled={isButtonDisabled}
//         style={styles.button}
//       >
//         Sign In
//       </Button>
//       {/* <Snackbar
//         visible={!!errorMessage}
//         onDismiss={() => setErrorMessage("")}
//         duration={3000}
//       >
//         {errorMessage}
//       </Snackbar> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//   },
//   title: {
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   input: {
//     marginBottom: 12,
//   },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   passwordInput: {
//     flex: 1,
//   },
//   iconButton: {
//     margin: 0,
//   },
//   button: {
//     marginTop: 16,
//   },
//   errorMessage: {
//     color: "red",
//     textAlign: "center",
//   },
// });

import { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import {
  Text,
  Button,
  Snackbar,
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
        // mode="outlined"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(value) => handleInputChange("password", value)}
          secureTextEntry={!passwordVisible}
          style={styles.passwordInput}
          // mode="outlined"
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
      {/* <Snackbar
        visible={!!errorMessage}
        onDismiss={() => setErrorMessage("")}
        duration={3000}
      >
        {errorMessage}
      </Snackbar> */}
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

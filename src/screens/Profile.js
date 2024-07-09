import { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { Text, Button } from "react-native-paper";
import { getWalksByUserId } from "../utils/api";
import WalkCard from "../components/WalkCard";
import { useAuth } from "../contexts/AuthContext";

export default Profile = ({setRefreshWalkList}) => {
  const { user, signOut } = useAuth();
  const [userWalks, setUserWalks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  const getWalks = async (userId) => {
    try {
      const { walks } = await getWalksByUserId(userId);
      setUserWalks(walks);
      setIsLoading(false);
    } catch (error) {
      console.log("Error retrieving walks:", error);
      //TO DO: add error handling
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getWalks(user.id);
  }, []);

  const handleCardPress = (walk) => {
    navigation.navigate("WalkDetails", { walk, setRefreshWalkList });
  };

  return (
    <View style={styles.mainView}>
    {user && <Text>Username: {user.username}</Text>}
      <Text style={styles.centeredText} variant="displayMedium">
        Profile
      </Text>
      <Text style={styles.centeredText} variant="headlineLarge">
        Your Walks
      </Text>
      {userWalks.length > 0 ? (
        //  userWalks.map((walk) => (
        <FlatList
          data={userWalks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCardPress(item)}>
              <WalkCard walk={item} />
            </TouchableOpacity>
          )}
        />
      ) : (
        //  ))
        <Text>You haven't uploaded any walks yet.</Text>
      )}
      <Button mode="contained" onPress={signOut}>
        Sign Out
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredText: {
    textAlign: "center",
    marginVertical: 5,
  },
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
});

import { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import { getWalksByUserId } from "../utils/api";
import WalkCard from "../components/WalkCard";

export default User = () => {
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
    }

    useEffect(() => {
        setIsLoading(true);
        getWalks(1);
    },[])

    const handleCardPress = (walk) => {
        navigation.navigate("WalkDetails", { walk });
    };
    
    return (
        <View style={styles.mainView} >
            {/* {Add username to profile when linked to userContext} */}
            <Text style={styles.centeredText} variant="displayMedium" >Profile</Text>
            <Text style={styles.centeredText} variant="headlineLarge" >Your Walks</Text>
            {userWalks ? userWalks.map((walk) => (
                <FlatList
                data={userWalks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleCardPress(item)}>
                    <WalkCard walk={item} />
                    </TouchableOpacity>
                )}
                />                
                )) : (
                    <Text>You haven't uploaded any walks yet.</Text>
                )
            }        
        </View>
    )
};

const styles = StyleSheet.create({
    centeredText: {
        textAlign: "center",
        marginVertical: 5,
    },
    mainView: {
        paddingTop: 30,
    }
})
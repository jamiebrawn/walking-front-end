import { Portal, Modal, Text, TextInput, Button } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import Dropdown from "./form-components/DropDown";

export default UploadModal = ({ isModalVisible, setIsModalVisible }) => {
    const [walkTitle, setWalkTitle] = useState("");
    const [walkDescription, setWalkDescription] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");

    const containerStyle = { backgroundColor: "white", padding: 20 };

    const difficulties = [
        { label: "Easy", value: "easy" },
        { label: "Moderate", value: "moderate" },
        { label: "Challenging", value: "challenging" },
    ];

    return (
        <Portal>
            <Modal
                visible={isModalVisible}
                onDismiss={() => setIsModalVisible(false)}
                contentContainerStyle={containerStyle}
            >
                <Text>Fill in the form to save your walk.</Text>
                <TextInput
                    label="Walk title"
                    value={walkTitle}
                    onChangeText={(text) => setWalkTitle(text)}
                />
                <TextInput
                    label="Walk description"
                    multiline={true}
                    value={walkDescription}
                    onChangeText={(text) => setWalkDescription(text)}
                />
                <Dropdown
                    items={difficulties}
                    selectedValue={selectedDifficulty}
                    onValueChange={(itemValue) =>
                        setSelectedDifficulty(itemValue)
                    }
                />
                <View style={styles.buttonContainer}>
                    <Button mode="contained" style={styles.button}>
                        Save
                    </Button>
                    {/* TO DO: update discard button onPress to clear stored route array? */}
                    <Button onPress={() => setIsModalVisible(false)} mode="contained" style={styles.button}>
                        Discard
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    button: {
        marginHorizontal: 5,
        minWidth: 100,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5
    },
});

// walk: {
//     creator_id: 1,
//     title: 'Bronte country 2',
//     description: 'Haworth to Withins Heights with only start, middle and end locations.',
//     distance_km: 11.72,
//     ascent: 345.75,
//     rating: null,
//     difficulty:  null,
//     start_latitude: 53.8289460,
//     start_longitude: -1.9569740,
//     start_altitude: 0
//     },
// locations: [    {   latitude: 53.8289460,
//                     longitude: -1.9569740,
//                     altitude: 0
//                 },
//                 {   latitude: 53.8168600,
//                     longitude: -2.0214000,
//                     altitude: 0
//                 },
//                 {   latitude: 53.8288640,
//                     longitude: -1.9571290,
//                     altitude: 0
//                 }
//             ]

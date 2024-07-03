import { Portal, Modal, Text, TextInput, Button } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import Dropdown from "./form-components/DropDown";

export default UploadModal = ({
    isModalVisible,
    setIsModalVisible,
    userLocationHistory,
    totalDistance,
    totalAscent,
}) => {
    const [walkTitle, setWalkTitle] = useState("");
    const [walkDescription, setWalkDescription] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState();

    const difficulties = [
        { label: "Easy", value: "easy" },
        { label: "Moderate", value: "moderate" },
        { label: "Challenging", value: "challenging" },
    ];

    const handleSave = () => {
        // Builds object to send to POST endpoint when we create api file
        const walkObject = {
            walk: {
                creator_id: 1,
                title: walkTitle,
                description: walkDescription,
                distance_km: totalDistance,
                ascent: totalAscent,
                difficulty: selectedDifficulty || null,
                start_latitude: userLocationHistory[0].latitude,
                start_longitude: userLocationHistory[0].longitude,
                start_altitude: userLocationHistory[0].altitude,
            },
            locations: userLocationHistory,
        };
    };

    return (
        <Portal>
            <Modal
                visible={isModalVisible}
                onDismiss={() => setIsModalVisible(false)}
                contentContainerStyle={styles.modal}
            >
                <Text style={styles.centeredText}>
                    Fill in the form to save your walk.
                </Text>
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
                    <Button
                        onPress={() => setIsModalVisible(false)}
                        mode="contained"
                        style={styles.button}
                    >
                        Discard
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modal: {
        backgroundColor: "white",
        padding: 20
    },
    centeredText: {
        textAlign: "center",
        marginVertical: 5
    },
    button: {
        marginHorizontal: 5,
        minWidth: 100,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
    },
});

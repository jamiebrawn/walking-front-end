import { Portal, Modal, Text, TextInput, Button } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";
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
    const [confirmDiscard, setConfirmDiscard] = useState(false);

    useEffect(() => {
        if (!isModalVisible) {
            setConfirmDiscard(false);
        }
    }, [isModalVisible]);

    const difficulties = [
        { label: "Easy", value: "easy" },
        { label: "Moderate", value: "moderate" },
        { label: "Challenging", value: "challenging" },
    ];

    const handleSave = () => {
        // Builds object to send to POST endpoint when we create api file
        const walkObject = {
            walk: {
                creator_id: 1, //Hardcoded for now but ultimately will need to use logged in users id
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

        setIsModalVisible(false);
    };
    
    const handleDiscard = () => {
        setConfirmDiscard(true);
    };

    const handleCancelDiscard = () => {
        setConfirmDiscard(false);
    };

    const handleConfirmDiscard = () => {
        // TO DO: update this to also clear stored route array (userLocationHistory)? 
        setWalkTitle('');
        setWalkDescription('');
        setSelectedDifficulty('');
        setIsModalVisible(false);
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
                {!confirmDiscard ? (
                    <View style={styles.buttonContainer}>
                        <Button onPress={handleSave} mode="contained" style={styles.button}>
                            Save
                        </Button>
                        <Button onPress={handleDiscard} mode="contained-tonal" style={styles.button}>
                            Discard
                        </Button>
                    </View>
                ) : (
                    <>
                        <Text style={styles.warningText}>Are you sure you want to discard your route?</Text>
                        <View style={styles.buttonContainer}>
                            <Button onPress={handleConfirmDiscard} mode="contained-tonal" style={styles.button}>
                                Confirm Discard
                            </Button>
                            <Button onPress={handleCancelDiscard} mode="contained" style={styles.button}>
                                Cancel Discard
                            </Button>
                        </View>
                    </>
                )}
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
    warningText: {
        textAlign: "center",
        marginVertical: 5,
        color: "red"
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

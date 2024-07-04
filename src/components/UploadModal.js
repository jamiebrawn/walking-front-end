import { Portal, Modal, Text, TextInput, Button } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Dropdown from "./form-components/DropDown";
import { addWalk } from "../utils/api";

export default UploadModal = ({
    isModalVisible,
    setIsModalVisible,
    userLocationHistory,
    totalDistance,
    totalAscent,
    setUserLocationHistory,
}) => {
    const [walkTitle, setWalkTitle] = useState("");
    const [walkDescription, setWalkDescription] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [confirmDiscard, setConfirmDiscard] = useState(false);
    const [uploadedWalk, setUploadedWalk] = useState(null);

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
        addWalk(walkObject).then((addedWalk) => {
            const { walk } = addedWalk;
            setUploadedWalk(walk);
        });
    };

    const handleDiscard = () => {
        setConfirmDiscard(true);
    };

    const handleCancelDiscard = () => {
        setConfirmDiscard(false);
    };

    const handleConfirmDiscard = () => {
        setUserLocationHistory([]);
        setWalkTitle("");
        setWalkDescription("");
        setSelectedDifficulty("");
        setIsModalVisible(false);
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setUserLocationHistory([]);
        setWalkTitle("");
        setWalkDescription("");
        setSelectedDifficulty("");
    };

    return (
        <Portal>
            <Modal
                visible={isModalVisible}
                onDismiss={() => setIsModalVisible(false)}
                contentContainerStyle={styles.modal}
            >
                {uploadedWalk ? (
                    <View style={styles.successContainer}>
                        <Text variant="headlineLarge">Success!</Text>
                        <Text style={styles.centeredText}>
                            Your walk "{uploadedWalk.title}" has been uploaded.
                        </Text>
                        <Button
                        onPress={handleClose}
                        mode="contained"
                        style={styles.button}
                        accessibilityLabel="Close"
                        >Close</Button>
                    </View>
                ) : (
                    <>
                        <View style={styles.title}>
                            <Text variant="headlineLarge">
                                Upload your walk
                            </Text>
                            <Ionicons
                                name="footsteps-outline"
                                size={36}
                                style={{ marginVertical: 5 }}
                            />
                            <Text
                                variant="titleMedium"
                                style={styles.centeredText}
                            >
                                Let others follow in your footsteps...upload
                                your walk to share it with the world!
                            </Text>
                        </View>
                        <TextInput
                            label="Walk title"
                            value={walkTitle}
                            onChangeText={(text) => setWalkTitle(text)}
                            style={styles.formInput}
                            accessibilityLabel="Walk title"
                        />
                        <TextInput
                            label="Walk description"
                            multiline={true}
                            value={walkDescription}
                            onChangeText={(text) => setWalkDescription(text)}
                            style={styles.formInput}
                            accessibilityLabel="Walk description"
                        />
                        <Dropdown
                            items={difficulties}
                            selectedValue={selectedDifficulty}
                            onValueChange={(itemValue) =>
                                setSelectedDifficulty(itemValue)
                            }
                            style={styles.formInput}
                            accessibilityLabel="Select walk difficulty"
                        />
                        {!confirmDiscard ? (
                            <View style={styles.buttonContainer}>
                                <Button
                                    onPress={handleSave}
                                    mode="contained"
                                    style={styles.button}
                                    accessibilityLabel="Upload walk"
                                >
                                    Upload
                                </Button>
                                <Button
                                    onPress={handleDiscard}
                                    mode="contained-tonal"
                                    style={styles.button}
                                    accessibilityLabel="Discard walk"
                                >
                                    Discard
                                </Button>
                            </View>
                        ) : (
                            <>
                                <Text style={styles.warningText}>
                                    Are you sure you want to discard your route?
                                </Text>
                                <View style={styles.buttonContainer}>
                                    <Button
                                        onPress={handleConfirmDiscard}
                                        mode="contained-tonal"
                                        style={styles.button}
                                        accessibilityLabel="Confirm discard"
                                    >
                                        Confirm Discard
                                    </Button>
                                    <Button
                                        onPress={handleCancelDiscard}
                                        mode="contained"
                                        style={styles.button}
                                        accessibilityLabel="Cancel discard"
                                    >
                                        Cancel Discard
                                    </Button>
                                </View>
                            </>
                        )}
                    </>
                )}
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modal: {
        backgroundColor: "white",
        padding: 20,
    },
    formInput: {
        marginBottom: 5,
    },
    centeredText: {
        textAlign: "center",
        marginVertical: 5,
    },
    title: {
        alignItems: "center",
        justifyContent: "center",
    },
    warningText: {
        textAlign: "center",
        marginVertical: 5,
        color: "red",
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
    successContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
    },
    linkText: {
        color: "blue",
        textDecorationLine: "underline",
        marginTop: 10,
    },
});
